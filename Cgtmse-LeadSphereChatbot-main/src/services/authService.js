import { supabase, isSupabaseConfigured } from './supabaseClient';

const AUTH_STORAGE_KEY = 'cgtmse_auth_user_v1';

// Authorized single user credentials requested by CGTMSE / LeadSphere
export const AUTHORIZED_CREDENTIALS = {
  email: 'cgtmse.leadsphere@gmail.com',
  password: 'Cgtmse@rahul.leadsphere'
};

class AuthService {
  constructor() {
    this.listeners = new Set();
    this._initSession();
  }

  _initSession() {
    // Check if Supabase session exists
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const userObj = {
            id: session.user.id,
            email: session.user.email,
            provider: 'supabase',
            authenticatedAt: new Date().toISOString()
          };
          this._saveUser(userObj);
        }
      }).catch(err => {
        console.warn('[Auth] Supabase session check error:', err);
      });
    }
  }

  _saveUser(user) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      this._notifyListeners(user);
    } catch (e) {
      console.error('[Auth] Failed to persist user to localStorage:', e);
    }
  }

  _clearUser() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      this._notifyListeners(null);
    } catch (e) {
      console.error('[Auth] Failed to remove user from localStorage:', e);
    }
  }

  _notifyListeners(user) {
    this.listeners.forEach(callback => {
      try {
        callback(user);
      } catch (err) {
        console.error('[Auth] Listener callback error:', err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return Boolean(user && user.email);
  }

  /**
   * Authenticate user with authorized email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, user?: object, message?: string}>}
   */
  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return {
        success: false,
        message: 'Please provide both email and password.'
      };
    }

    // 1. Verify credentials match the single authorized account
    const isMasterEmailMatch = cleanEmail === AUTHORIZED_CREDENTIALS.email.toLowerCase();
    const isMasterPasswordMatch = cleanPassword === AUTHORIZED_CREDENTIALS.password;

    if (!isMasterEmailMatch || !isMasterPasswordMatch) {
      return {
        success: false,
        message: 'Invalid credentials. Only the authorized CGTMSE account is permitted.'
      };
    }

    // 2. If Supabase is connected, authenticate or synchronize with Supabase Auth
    let supabaseUser = null;
    let supabaseSession = null;
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (error) {
          // If user doesn't exist in Supabase yet, attempt sign-up automatically
          if (error.message?.toLowerCase().includes('invalid login credentials') || error.status === 400) {
            const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
              email: cleanEmail,
              password: cleanPassword
            });
            if (!signUpErr && signUpData?.user) {
              supabaseUser = signUpData.user;
              supabaseSession = signUpData.session;
            }
          }
        } else if (data?.user) {
          supabaseUser = data.user;
          supabaseSession = data.session;
        }
      } catch (sbErr) {
        console.warn('[Auth] Supabase cloud auth attempted with fallback:', sbErr);
      }
    }

    // Generate valid session token
    const directToken = 'cgtmse_auth_' + btoa('cgtmse.leadsphere@gmail.com:Cgtmse@rahul.leadsphere');
    const token = supabaseSession?.access_token || directToken;

    // 3. Create active session object
    const user = {
      id: supabaseUser?.id || 'cgtmse-authorized-user',
      email: 'Cgtmse.leadsphere@gmail.com',
      token,
      displayName: 'CGTMSE Authorized User',
      provider: supabaseUser ? 'supabase' : 'direct',
      authenticatedAt: new Date().toISOString()
    };

    this._saveUser(user);

    return {
      success: true,
      user,
      message: 'Authentication successful! Access granted.'
    };
  }

  getAuthToken() {
    const user = this.getCurrentUser();
    return user?.token || null;
  }

  /**
   * Log out current user
   */
  async logout() {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[Auth] Supabase sign out warning:', err);
      }
    }
    this._clearUser();
    return { success: true };
  }
}

export const authService = new AuthService();
