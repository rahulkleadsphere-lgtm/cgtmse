# CGTMSE Guarantee Management System (GMS) - 100 Comprehensive Operational FAQs


## Login, Access & Dashboard

### How do I log in to GMS?
To log in to the Guarantee Management System (GMS):
1. Open your browser and navigate to the official CGTMSE GMS portal (https://www.cgtmse.in/gms).
2. Enter your Member Lending Institution (MLI) User ID, registered Password, and the Captcha displayed on the screen.
3. Authenticate using Two-Factor Authentication (OTP sent to your registered mobile number/email) or Digital Signature Certificate (DSC) if mandated by your institution.
4. Click 'Sign In'. Ensure your user role (Maker/Checker) matches the branch or zonal access granted by your Head Office Nodal Officer.

### What can I see on the GMS dashboard?
The GMS dashboard provides a unified executive view of your institution's credit guarantee portfolio:
- **Active Guarantees**: Total count and aggregate sanctioned credit exposure covered under CGTMSE.
- **Pending Actions**: Actionable queues for Maker/Checker approvals, draft lodgements, and amendment approvals.
- **Fee & Invoicing**: Upcoming Annual Guarantee Fee (AGF) demand notices, paid invoices, and overdue fee alerts.
- **NPA & Claims Pipeline**: Accounts marked as NPA, guarantees approaching the 18-month lock-in expiry, pending claim deficiency responses, and settled claims summary.
- **Notifications & Circulars**: Real-time broadcasts, procedural updates, and scheme revisions issued by CGTMSE.

### Why can I not see a particular GMS menu?
GMS menus are role-based and governed by institutional entitlements:
1. **Role-Based Access Control (RBAC)**: GMS enforces a strict Maker-Checker segregation. Certain menus (e.g., Claim Authorization, Bulk Approval) are visible only to Checker or Admin users.
2. **Organizational Hierarchy**: Branch-level users may not have access to Zonal or Head Office (Nodal) reconciliation and policy menus.
3. **Deactivated Permissions**: If your user profile has not been assigned the specific module by your MLI Nodal Officer, the menu remains hidden.
**Resolution**: Contact your institution's CGTMSE Nodal Officer or Central Administrator to review and map your user profile permissions.

### How do I change my GMS password?
To change your GMS password:
1. Log in to GMS, click on your Profile icon at the top-right corner, and select 'Change Password'.
2. Enter your Current Password, followed by your New Password adhering to complexity rules (minimum 8-16 characters, uppercase, lowercase, numeric, and special character).
3. Re-enter the new password to confirm and click 'Submit'.
If you have forgotten your password, use the 'Forgot Password' link on the login screen, enter your User ID and PAN/Registered Email, verify the OTP, and reset credentials.

### What should I do if my GMS account is locked?
A GMS user account is automatically locked after 3 to 5 consecutive unsuccessful login attempts or prolonged inactivity (e.g., 90 days without login):
1. **Self-Service Unlock**: On the login screen, click 'Unlock Account', input your User ID, verify OTP received on your registered mobile/email, and reset your password.
2. **Administrative Unlock**: If self-service is disabled for your institution, escalate the request to your Bank/MLI Central Nodal Officer (User Management Module) who can unlock the profile and trigger a temporary credential reset.


## Guarantee Lodgement

### How do I lodge a new guarantee in GMS?
To lodge a new guarantee application in GMS:
1. Navigate to **Guarantee Management > New Guarantee Lodgement**.
2. Select the applicable scheme (e.g., Credit Guarantee Scheme I - CGS-I).
3. Enter the mandatory Borrower Details (PAN, Udyam Registration Number, Constitution, Social Category, Gender, Address).
4. Input Credit Facility Details (Sanction Date, Facility Type: Term Loan/Working Capital, Sanctioned Amount, ROI, Security nature).
5. Review computed Annual Guarantee Fee (AGF) and coverage percentage.
6. Save as Draft or Submit for Checker Authorization.

### How do I select the applicable guarantee scheme?
In the 'Scheme Selection' dropdown during new lodgement:
- **CGS-I (General)**: For standard Micro and Small Enterprises in manufacturing, service, and retail trade up to ₹500 lakh.
- **Special Schemes**: Select specific windows such as Women Entrepreneurs, SC/ST MSEs, Aspirational Districts, ZED Certified units, or Agniveer schemes to automatically activate concessional fee rates (10% discount) and enhanced coverage (85%).
- Ensure the borrower's Udyam enterprise type (Micro or Small) aligns with the selected scheme parameters.

### How do I enter borrower details?
Under the 'Borrower Information' tab:
1. Enter the Entity PAN (or Proprietor PAN for proprietorships). GMS verifies PAN formatting and duplicate records.
2. Enter the valid **Udyam Registration Number (URC)**. GMS connects with Udyam API to auto-populate enterprise name, enterprise category (Micro/Small), and activity (NIC code).
3. Fill promoter details, business address, state, district (identifying Aspirational Districts automatically), and social category (SC/ST/General/Women-owned).
4. Verify all fields before proceeding to the facility section.

### How do I enter credit facility details?
Under the 'Credit Facility' tab:
1. Select the Facility Type: **Term Loan (TL)**, **Working Capital (WC)**, or **Composite Loan**.
2. Enter Bank Sanction Reference Number and Sanction Date.
3. Enter the Sanctioned Amount (must not exceed ₹500 lakh overall across all MLIs for the borrower).
4. Specify Loan Tenure (in months) and Moratorium Period (for Term Loans).
5. Indicate whether the facility is under the Hybrid Security product (if partial collateral is obtained for limits above the guaranteed portion).

### Can I save a guarantee application as a draft?
Yes. GMS allows you to save incomplete applications by clicking the **'Save as Draft'** button at the bottom of the lodgement form.
- The application is assigned a temporary Draft Reference ID.
- You can retrieve and edit it anytime from **Guarantee Management > Draft Applications**.
- Drafts do not consume guarantee limits or incur fees until submitted and authorized by the checker.

### How do I identify a duplicate guarantee?
GMS automatically runs de-duplication checks based on borrower PAN, Udyam Registration Number, and MLI Loan Account Number:
1. If an active guarantee already exists under the same PAN/Account number, GMS flags a 'Duplicate Guarantee Warning'.
2. The system checks cumulative exposure across all Member Lending Institutions to ensure the aggregate limit of ₹500 lakh is not breached.
3. To manually check, go to **Search & Enquiry > Guarantee Search** and search by Borrower PAN.

### Why is my guarantee application failing validation?
Common validation failures in GMS include:
- **Invalid/Mismatched Udyam Number**: Enterprise classified as Medium (ineligible) or invalid NIC code.
- **Sanction Date Validation**: Sanction date is in the future or older than permissible backlog entry limits.
- **Limit Exceeded**: Aggregate sanctioned credit under the PAN exceeds ₹500 lakh (or ₹200 lakh for Retail Trade).
- **Missing Mandatory Fields**: Social category, gender, PIN code, or facility tenure left blank.
- **Format Errors**: Incorrect account number format or invalid PAN structure.
Review the red error banner at the top of the form for specific field-level validation messages.

### How do I submit a guarantee application?
To submit an application:
1. Complete all tabs (Borrower Details, Facility, Security, and Fee Preview).
2. Ensure Maker validation passes with zero errors.
3. Click **'Submit for Authorization'**.
4. The designated MLI Checker logs in, navigates to **Authorization Queue > Guarantee Approvals**, verifies loan documents against entered data, and approves using DSC or authorized e-sign.

### How do I know whether my guarantee was successfully submitted?
Upon successful checker approval:
1. The system displays a confirmation banner with a permanent **Guarantee Number (CGPAN)**.
2. The guarantee status transitions from 'Pending Authorization' to 'Cover Issued / Pending Fee Payment' or 'Active' (if auto-debited via nodal pool).
3. An acknowledgment notification is sent to the registered branch email, and the record appears in the 'Active Guarantees' report.

### How do I search for an existing guarantee?
Navigate to **Search & Enquiry > Guarantee Search**:
- Search by **Guarantee Number (CGPAN)** for direct lookup.
- Search by **Borrower PAN** or **Udyam Number** to view all guarantees associated with the enterprise.
- Search by **Bank Loan Account Number**, **Branch Code**, or **Sanction Date Range**.
Click 'Search' to display filtered results in the grid.

### How do I check guarantee status?
In GMS, navigate to **Guarantee Management > View Guarantee Status** or perform a Guarantee Search. Key statuses include:
- **Draft**: Incomplete application saved by Maker.
- **Pending Authorization**: Submitted by Maker, awaiting Checker approval.
- **Pending Fee Payment**: Approved by Checker, awaiting Annual Guarantee Fee remittance.
- **Active / In-Force**: Guarantee fee received, guarantee cover active and in full compliance.
- **NPA Marked**: Account reported as NPA by lender.
- **Claim Lodged / Settled**: Guarantee invoked and claim processed.
- **Closed**: Loan fully repaid and guarantee terminated.

### What does an active guarantee mean?
An **Active Guarantee** (or 'In-Force') signifies that:
1. All borrower and facility criteria have been verified and validated by CGTMSE.
2. The upfront/annual guarantee fee has been successfully remitted and reconciled.
3. The Member Lending Institution is fully covered against credit default up to the sanctioned coverage percentage (75% or 85%) during the validity tenure.
4. The 18-month lock-in period countdown begins from the date of guarantee issuance or last disbursement.

### How do I view complete guarantee details?
To view the complete dossier of a guarantee:
1. Go to **Search & Enquiry > Guarantee Search** and enter the Guarantee Number or Account Number.
2. Click the Guarantee Number link or the 'Eye' icon in the Action column.
3. The detailed view displays comprehensive tabs: Basic Borrower Information, Credit Facility Limits, Payment & Fee History, Amendment Trail, NPA & Legal Action records, and Downloadable Guarantee Certificate.


## Guarantee Amendment

### How do I amend guarantee details?
To request an amendment in GMS:
1. Navigate to **Guarantee Management > Guarantee Amendment**.
2. Search for the active guarantee using the CGPAN / Guarantee Number.
3. Click 'Initiate Amendment', modify the editable fields, and provide justification along with internal bank sanction / approval reference.
4. Submit the amendment request for Checker authorization.
5. Note: Any enhancement in limit requires payment of differential guarantee fee.

### Which guarantee fields can be amended?
Fields eligible for amendment in GMS include:
- **Permissible for Amendment**: Enhanced/reduced sanction amount (within scheme ceiling), change in loan account number due to CBS migration, loan tenure extension, interest rate revision, and borrower address/contact updates.
- **Non-Amendable Fields**: Borrower PAN (requires cancellation and re-lodgement if erroneous), original sanction date (unless CBS verified), and fundamental scheme category (e.g., CGS-I cannot be converted retrospectively without Nodal approval).

### How do I check guarantee amendment history?
1. Open the guarantee record in **Search & Enquiry > Guarantee Search**.
2. Click on the **'Amendment History'** tab.
3. GMS maintains an immutable audit log detailing: Date of amendment, Fields modified (Old Value vs New Value), Maker User ID, Checker User ID, and Approval Timestamp.

### Why is my guarantee amendment request rejected?
Common reasons for amendment rejection by CGTMSE or institutional checkers:
- **Exceeding Cap**: The enhanced credit limit exceeds the maximum allowable cap (₹500 lakh for MSEs or ₹200 lakh for Retail).
- **Account Already in NPA**: Limit enhancement amendments are strictly prohibited for accounts already marked as NPA.
- **Unpaid Fees**: Outstanding Annual Guarantee Fees pending for prior cycles.
- **Inadequate Justification**: Lack of supporting bank sanction memorandum for tenure extension or limit hike.


## Guarantee Fee & Payment

### How do I view guarantee fee details?
To view fee details:
1. Go to **Fee Management > Fee Demand & Calculation**.
2. Search by Guarantee Number to view the Annual Guarantee Fee (AGF) breakdown:
   - Base Fee Rate (e.g., 0.37%, 0.55%, 0.60%, 1.20%, 1.35%)
   - Concessions applied (e.g., 10% concession for Women / SC/ST / ZED)
   - Risk Premium Surcharges (based on bank's NPA track record)
   - Total Fee Amount and Applicable GST.

### How do I check whether a guarantee fee has been paid?
1. Navigate to **Fee Management > Payment Reconciliation & Receipts**.
2. Enter the Guarantee Number or Financial Year demand notice.
3. The grid displays: Payment Status ('Paid', 'Pending', 'Overdue'), Transaction Reference Number (UTR), Payment Date, and link to download the GST-compliant Fee Receipt.

### What should I do if payment information is not updated?
If fee remittance has been executed via NEFT/RTGS or Central Nodal Pool debit but remains unreflected in GMS after 48 hours:
1. Go to **Fee Management > Payment Verification**.
2. Click 'Verify Payment', input the Bank UTR Number, payment date, and remitted amount.
3. If auto-reconciliation fails, send the UTR payment voucher to your MLI Nodal Desk or raise a ticket on the CGTMSE Helpdesk under 'Fee Reconciliation' with the subject 'UTR Reconciliation Pending'.


## NPA

### When should an account be marked NPA?
An account must be marked as NPA in GMS strictly in accordance with **Reserve Bank of India (RBI) prudential norms**—typically when interest and/or installment of principal remains overdue for more than **90 days**.
- The NPA date reported in GMS must precisely match the date recorded in the bank's Core Banking System (CBS).
- Prompt reporting is mandatory for claim eligibility; delay in reporting may attract audit queries during claim appraisal.

### How do I mark a guarantee as NPA?
To mark a single account as NPA:
1. Navigate to **NPA Management > Mark NPA**.
2. Search by Guarantee Number (CGPAN) or Loan Account Number.
3. Enter the exact **NPA Date** (as per CBS) and **Outstanding Principal & Interest** on the date of NPA.
4. Provide the reason for default (e.g., market downturn, working capital crunch, promoter dispute).
5. Click 'Submit for Checker Authorization'. Once authorized, the guarantee status updates to 'NPA Marked'.

### Can I mark multiple accounts as NPA?
Yes. Member Lending Institutions can perform bulk NPA marking:
1. Navigate to **NPA Management > Bulk NPA Upload**.
2. Download the standard CSV/Excel NPA template provided by GMS.
3. Populate the columns: Guarantee Number, Bank Account Number, NPA Date (DD/MM/YYYY), Outstanding on NPA Date, and Default Code.
4. Upload the completed file. GMS validates all rows, displays an acceptance/error summary, and sends valid rows to Checker authorization queue.

### Why is my NPA date rejected?
Common causes for NPA date rejection in GMS:
- **NPA Prior to Sanction**: The entered NPA date is earlier than the loan sanction or guarantee issuance date.
- **Future Date**: The NPA date is in the future.
- **Lock-in Timing Anomaly**: NPA occurred during an inconsistent ledger period without prior active fee payment.
- **Format Error**: Date format not conforming to DD/MM/YYYY.
Ensure the date reflects your internal CBS NPA ledger date exactly.

### Can I modify the NPA date after submission?
Once submitted and authorized, the NPA date cannot be altered directly by branch users because it impacts lock-in computation and claim validity.
- If an inadvertent clerical error occurred, submit an **NPA Rectification Request** through your MLI Central Nodal Officer along with a CBS account statement and audit certificate justifying the correction.
- CGTMSE Operations reviews and updates the rectified date on an exceptional basis.

### How do I reverse an incorrect NPA marking?
If an account was erroneously marked as NPA or if the account has been upgraded back to 'Standard' following full recovery of overdues:
1. Navigate to **NPA Management > Upgrade / Reverse NPA**.
2. Enter the Guarantee Number and select 'Account Upgraded / Erroneous Marking'.
3. Provide the Upgradation Date and attach CBS ledger extract showing overdue clearance.
4. Submit for Checker authorization. Once approved, the guarantee returns to 'Active / Standard' status.

### How do I view NPA details?
1. Go to **NPA Management > View NPA Accounts** or **Search & Enquiry > Guarantee Search**.
2. Filter by branch code, date range, or Guarantee Number.
3. Click on the guarantee record to see: NPA Date, Outstanding Balance at NPA, Days Overdue, and Lock-in Period Status (whether eligible for claim lodgement).


## Legal Action

### Why is legal action information required?
Under CGTMSE statutory guidelines, initiating legal recovery proceedings is a **mandatory prerequisite** before lodging a claim:
- CGTMSE is a risk-sharing partner; lenders must demonstrate due diligence in legal recovery of public funds.
- Permissible legal actions include: Notice under **SARFAESI Act 2002**, filing an application before **Debt Recovery Tribunal (DRT)**, suit in **Civil Court**, referral to **Lok Adalat**, or proceedings under **Section 138 of Negotiable Instruments Act** (for dishonored cheques).
- For loans up to ₹10 lakh, legal action requirements may follow simplified recovery thresholds as per prevailing circulars.

### How do I update legal action details?
To update legal action:
1. Navigate to **Legal Action Management > Update Legal Proceedings**.
2. Select the NPA-marked guarantee.
3. Select the Legal Action Type (SARFAESI / DRT / Civil Suit / Lok Adalat / Sec 138).
4. Enter the Legal Action Date (e.g., Date of issuance of SARFAESI Section 13(2) notice or suit filing date), Court / Tribunal Name, Case Reference Number, and Advocate Details.
5. Click 'Save & Submit'.

### Can I upload legal-action documents?
Yes. GMS provides document attachment capabilities under the legal tab:
1. Supported formats: PDF (file size up to 2MB to 5MB depending on portal limits).
2. Key documents to upload: Copy of SARFAESI Notice under Sec 13(2) with proof of dispatch/service, Copy of DRT / Civil Suit Plaint with filing receipt, or Lok Adalat award/settlement copy.
3. Clear scanned copies ensure seamless validation during claim processing.

### How do I check whether legal-action requirements are complete?
In GMS, navigate to **Legal Action Management > Legal Compliance Status**:
- Check the 'Legal Compliance Flag' for the guarantee.
- If the status shows **'Complete / Verified'**, the legal prerequisite for claim lodgement has been satisfied.
- If marked **'Incomplete'**, review missing details such as Case Number, Legal Notice Date, or pending document upload.


## Claim Eligibility

### How do I check whether a guarantee is eligible for claim?
To determine claim eligibility, navigate to **Claims > Check Claim Eligibility**:
A guarantee is eligible only when ALL 4 criteria are fulfilled:
1. **Lock-in Period Satisfied**: Exactly 18 months have elapsed from the date of guarantee issuance or last disbursement date (whichever is later).
2. **NPA Marked**: The account is classified as NPA in GMS with an authenticated NPA date.
3. **Legal Action Initiated**: Mandatory legal recovery proceedings (SARFAESI, DRT, Lok Adalat, or Sec 138) have been filed and recorded.
4. **No Fee Dues**: All Annual Guarantee Fees (AGF) up to the NPA date are fully paid.

### Why is my guarantee not appearing for claim lodgement?
If a guarantee does not appear in the claim lodgement list, check the following:
- **Lock-in Period Not Expired**: 18 months have not yet passed since guarantee cover issuance or last loan disbursement.
- **NPA Not Authorized**: NPA marking is in draft or awaiting Checker authorization.
- **Legal Action Missing**: Legal action has not been updated or verified in the Legal module.
- **Fee Arrears**: AGF for the preceding period is overdue.
- **Existing Claim in Process**: An earlier 1st installment claim is already under active review.

### What information is checked before claim lodgement?
GMS automatically validates:
- Lock-in period compliance (18 months).
- Disbursed amount vs Sanctioned amount (claims apply only to disbursed principal and accrued interest up to NPA).
- Outstanding balance on the date of NPA.
- Verified proof of legal action initiation.
- MLI fee payment reconciliation status.
- Cumulative claims history across the borrower entity.

### Can I lodge a claim if mandatory information is missing?
No. GMS strictly blocks claim submission if any mandatory parameter (e.g., CBS loan account statement, legal action date, or NPA verification) is missing.
- The system prevents Maker submission with explicit validation alerts.
- Ensure all borrower, facility, NPA, and legal tabs are fully compliant before initiating claim lodgement.


## Claim Lodgement

### How do I lodge a claim in GMS?
To lodge a claim:
1. Navigate to **Claims > Lodge Claim (1st Installment)**.
2. Select the eligible Guarantee Number from the list.
3. Review the auto-populated figures (Sanctioned Amount, Guaranteed Amount, Coverage %).
4. Enter Outstanding Balance as on NPA Date, Recoveries effected post-NPA, and Claim Calculation Base.
5. Upload required documents (Legal Notice copy, Statement of Account, NPA Certificate).
6. Submit for Checker Authorization.

### What information is required for claim lodgement?
Key parameters required during claim lodgement:
- Guarantee Number (CGPAN) & Loan Account Number.
- Date of NPA & Ledger Balance on date of NPA.
- Breakup of Principal and Interest up to NPA date.
- Details of recoveries made after NPA date.
- Legal action details (court/tribunal reference, notice date).
- Bank's dedicated settlement account IFSC & Account number for fund credit.

### How do I select the claim type?
In the Claims Module, select:
- **First Claim (1st Installment - 75%)**: Invocation of guarantee following NPA and legal action initiation. CGTMSE pays 75% of the eligible guaranteed amount.
- **Final Claim (2nd Installment - 25%)**: Lodged after legal proceedings have concluded or decrees executed, settling the residual 25% adjusted for recoveries.

### Can I lodge an individual claim?
Yes. Most branch users lodge individual claims through the standard interactive web form under **Claims > Lodge Claim**, allowing line-by-line verification of ledger figures, document uploads, and audit verification.

### Can I lodge claims in bulk?
Yes. Head Office and Zonal administrators can lodge claims in bulk:
1. Go to **Claims > Bulk Claim Lodgement**.
2. Download the pre-formatted GMS Bulk Claim Template (CSV/XLS).
3. Fill in the guarantee IDs, outstanding at NPA, recoveries, and legal dates.
4. Upload the batch file for asynchronous processing.

### How do I upload a claim file?
1. Navigate to **Claims > Bulk Claim Lodgement > Upload File**.
2. Click 'Choose File' and select the formatted CSV/XLS file.
3. Click 'Validate & Upload'.
4. GMS parses the structure and shows progress in the 'Upload Status & Log' section.

### How do I know whether my claim file was accepted?
In **Claims > Bulk Upload History**:
- **Status: Processed / Accepted**: The entire file was accepted and claims populated.
- **Status: Partially Processed**: Some rows passed while others failed.
- **Status: Rejected**: File schema or header mismatch. Download the generated 'Error Log' to view row-by-row reasons.

### Why did some records pass and others fail in a bulk claim?
In bulk uploads, records are validated independently:
- Passed records: Met all criteria (18-month lock-in, fee paid, legal action recorded, valid figures).
- Failed records: Tripped on individual business rules (e.g., lock-in not completed, outstanding mismatch, invalid guarantee number, missing legal dates).
Download the Error File, rectify the failed rows, and re-upload only the corrected subset.

### How is the claim amount calculated?
Claim amount is calculated as:
1. **Eligible Default Amount** = Minimum of (Sanctioned Credit Facility, Outstanding Balance on NPA Date) minus Recoveries made post-NPA.
2. **Guaranteed Percentage** = 75% or 85% (depending on borrower category: Women/SC/ST/Micro up to ₹5L receive 85%, others 75%).
3. **First Installment Payable** = 75% of [Guaranteed Percentage × Eligible Default Amount].
4. The remaining 25% is reserved for the Final Claim after conclusion of recovery proceedings.

### Why is my claim amount rejected?
Claim amounts are rejected by GMS or CGTMSE evaluators if:
- Entered outstanding balance exceeds the sanctioned guaranteed limit.
- Unapplied penal interest or post-NPA unearned charges are included in the claim calculation.
- Recoveries made post-NPA have not been properly deducted from the default amount.
- Calculation does not align with CBS ledger statement.

### Can I change the claim amount before submission?
Yes. While the claim application is in **Maker Draft** stage, you can modify financial values freely.
Once submitted to the Checker, the Checker can return it to Maker for value modification.
After Checker authorization and transmission to CGTMSE, figures cannot be edited directly without raising a deficiency resolution request.

### Can I cancel a claim before approval?
Yes. If the borrower settles overdues or an account is restructured prior to CGTMSE approval:
1. Go to **Claims > Pending Claims**.
2. Select the claim and choose **'Recall / Cancel Claim'**.
3. Provide institutional cancellation justification (e.g., compromise settlement, OTS, or full account closure).
4. Checker confirms cancellation. The guarantee is reverted to appropriate active/closed status.


## Claim Documents

### What documents are required for claim lodgement?
Mandatory claim documents include:
1. **Account Statement**: Complete CBS ledger statement from sanction date up to NPA date.
2. **Sanction Letter**: Duly acknowledged loan sanction terms and conditions.
3. **Proof of Legal Action**: Stamped copy of SARFAESI Sec 13(2) notice with dispatch proof, DRT application, or Court Plaint.
4. **NPA Classification Certificate**: Bank auditor/branch manager certified statement of NPA date and ledger outstanding.
5. **Declaration Form**: Undertaking signed by authorized bank officer confirming compliance with CGTMSE norms and no collateral obtained.

### Why is my claim document upload failing?
Common upload issues:
- **File Size Limit**: Document exceeds maximum size limit (typically 5MB per file).
- **Unsupported Format**: File format is not PDF (e.g., zip, tiff, docx are rejected in claim upload).
- **Password Protection**: PDF is password-encrypted or contains digital security preventing server parsing.
- **Special Characters in Filename**: Filename containing symbols like #, %, &, or spaces. Rename file cleanly (e.g., 'Claim_Docs_12345.pdf') and retry.

### Can I replace an uploaded claim document?
Yes, prior to final Checker submission or during **Deficiency Resolution**:
1. Go to the Claim Document Upload section.
2. Click the 'Delete' / 'Trash' icon next to the previously uploaded file.
3. Upload the revised PDF document and click 'Save Changes'.

### How do I know whether all mandatory claim documents are uploaded?
In the Claim Lodgement screen:
- Each mandatory document category features a red asterisk (*).
- Once uploaded and verified, the document status displays a green checkmark **'Uploaded'**.
- If any mandatory document is absent, the 'Submit Claim' button remains disabled or prompts a validation error identifying the missing document.


## Claim Validation & Deficiency

### What happens after claim submission?
After claim submission by the MLI Checker:
1. The claim is queued for automated business rule validation by the GMS engine.
2. It is assigned to a CGTMSE Claims Officer for desk scrutiny.
3. The officer verifies ledger balances, legal action validity, and eligibility.
4. Outcomes: The claim is either approved for settlement, flagged with 'Deficiency', returned for clarification, or rejected.

### How do I check claim status?
Navigate to **Claims > Claim Status Tracker**:
- Search by Claim Reference Number, Guarantee Number, or Bank Account Number.
- The tracker displays the lifecycle stage: 'Submitted', 'Under Scrutiny', 'Deficiency Raised', 'Approved', 'Payment Voucher Generated', or 'Settled'.

### What does 'Deficiency' mean in a claim?
A **Deficiency** is an official query or clarification raised by CGTMSE during claim evaluation:
- Occurs when submitted documentation is unclear, recovery amounts do not tally, legal notice proof is incomplete, or ledger calculations require itemized explanation.
- The claim is temporarily placed on hold awaiting the bank's timely response (usually within 30 to 45 days).

### How do I respond to a claim deficiency?
To answer a deficiency:
1. Go to **Claims > Deficiency Management > Pending Deficiencies**.
2. Click on the Claim Reference Number to view the specific query raised by CGTMSE.
3. Type your institutional clarification in the 'Response Remarks' text area.
4. Attach supporting documents (e.g., revised bank statement, postal dispatch receipt).
5. Click 'Submit Response'. The claim re-enters the evaluation queue.

### What does 'Returned' mean for a claim?
'Returned' means the claim application has been sent back to the Member Lending Institution due to procedural discrepancies (e.g., wrong claim type selected, substantive accounting misalignment, or premature lodgement before lock-in completion).
- The MLI must address the underlying issue before re-authorizing and resubmitting.

### What does 'Rejected' mean for a claim?
'Rejected' indicates that the claim has been formally disqualified by CGTMSE due to violation of core scheme covenants:
- Typical reasons: Ineligible borrower, primary collateral was held, failure to initiate legal proceedings, default during lock-in without coverage, or misrepresentation.
- A formal Claim Rejection Letter detailing grounds for repudiation is downloadable from the portal.

### Can a rejected claim be resubmitted?
A rejected claim cannot be resubmitted directly through standard menus.
- If the MLI believes the rejection was based on a factual misunderstanding or has new documentary evidence, the MLI Head Office Nodal Officer must submit a formal **Claim Representation / Appeal** to CGTMSE Appellate Committee within the prescribed timeframe.


## Claim Approval

### How do I know whether my claim is approved?
1. GMS updates the status to **'Claim Approved'**.
2. An automated approval notification is dispatched to the MLI Nodal email.
3. The approved claim amount is displayed under **Claims > Approved Claims**, along with the approval date and payment voucher reference.

### Who approves a claim?
Claims undergo a two-tier evaluation and approval process:
1. **Internal MLI Authorization**: Branch Maker -> Branch/Zonal Checker authorizes the claim prior to transmission.
2. **CGTMSE Sanctioning Authority**: Scrutiny by Claims Officer -> Recommendation by Assistant General Manager (AGM) / Deputy General Manager (DGM) -> Final sanction by Competent Authority / Claims Committee as per delegated financial powers.

### Why is my claim pending approval?
Claims remain pending approval when:
- The claim is in active review with the CGTMSE assessment desk.
- An outstanding deficiency response is awaited from the bank.
- High-value claim amounts requiring review by the Higher Committee or Board.
- Year-end audit reconciliation or periodic payment batch processing.

### What is an exception claim?
An **Exception Claim** is a claim that deviates from standard auto-approval parameters:
- Examples: Claim where NPA date differs marginally from CBS due to system migration, accounts restructured under RBI moratorium, or special resolution frameworks.
- Exception claims require detailed institutional remarks and manual sign-off by the CGTMSE Competent Committee.


## Claim Settlement

### What happens after claim approval?
Once a claim is approved:
1. GMS generates an electronic **Claim Payment Advice / Voucher**.
2. Funds are credited via NEFT/RTGS to the designated nodal pool or settlement account of the Member Lending Institution.
3. The MLI credits the received amount into the borrower's loan account, reducing the outstanding liability.

### How do I check the approved claim amount?
1. Go to **Claims > Settled Claims Summary**.
2. Search by Guarantee Number or Claim ID.
3. View the itemized breakdown: Claimed Amount, Disallowed Deductions (if any), Net Approved Amount (75% first installment), and Payment UTR Number.

### How do I check claim settlement status?
Navigate to **Claims > Settlement Status**:
- **Approved**: Sanctioned, queued for treasury fund release.
- **Funds Disbursed**: Electronic transfer initiated.
- **Settled**: Funds successfully credited to bank account and UTR confirmed.

### How do I check payment or voucher details?
In **Claims > Payment Vouchers**:
1. Enter the Financial Year and Claim ID.
2. Download the official **Claim Settlement Voucher (PDF)** containing CGTMSE payment order number, date, bank account credited, IFSC, and UTR.

### What should I do if the settlement amount differs from my expectation?
If the settled amount is lower than claimed:
1. Download the **Settlement Calculation Sheet** from the Claim Details page.
2. Check for deductions: Unapplied interest, unapproved legal expenses, ineligible facility portions, or adjustments for post-NPA recoveries.
3. If an error is identified, submit a reconciliation query via **Claims > Settlement Discrepancy** with ledger proof.

### How do I check claim payment status?
Under **Claims > Payment Enquiry**:
- Search by UTR number or Guarantee Number.
- GMS displays the exact settlement date and CBS credit confirmation status.


## Recovery & Final Claim

### How do I update recovery details?
Under CGTMSE covenants, any recoveries made from the borrower post-claim must be shared pro-rata with CGTMSE:
1. Navigate to **Recovery Management > Remit Recovery**.
2. Select the Guarantee Number where 1st claim was settled.
3. Enter the gross recovery amount, recovery date, source (e.g., asset sale, SARFAESI auction, compromise settlement), and legal expenses incurred.
4. The system calculates CGTMSE's pro-rata share (e.g. 75% or 85%).
5. Remit the amount and input the payment UTR.

### Why is recovery information required?
Recovery sharing is a core statutory requirement of the Credit Guarantee Scheme:
- CGTMSE is subrogated to the rights of the lender upon payment of claim.
- Regular updates maintain bank compliance, avoid blacklisting or surcharges, and are mandatory to unlock eligibility for lodging the **Final Claim (remaining 25%)**.

### How do I lodge a final claim?
To lodge the Final Claim (2nd installment - 25%):
1. Navigate to **Claims > Lodge Final Claim (25%)**.
2. Ensure legal proceedings have attained finality (court decree, DRT recovery certificate, execution of SARFAESI, or write-off certification).
3. Confirm all recoveries have been remitted to CGTMSE.
4. Upload final legal disposal decree / auditor certificate.
5. Submit for approval.

### What is checked before final claim submission?
Before final claim lodgement, GMS verifies:
- Settlement of 1st installment claim.
- Proper accounting and remittance of all interim borrower recoveries.
- Legal status verified as fully concluded or exhausted.
- Certified residual loss statement signed by authorized signatory.

### How do I check final claim status?
Navigate to **Claims > Final Claim Tracker**:
- Track review, approval, and final settlement voucher.
- Upon final settlement, the guarantee automatically transitions to 'Closed - Settled'.


## Guarantee Closure

### How do I close a guarantee?
A guarantee can be closed under the following circumstances:
1. **Full Loan Repayment (Normal Closure)**: Go to **Guarantee Management > Guarantee Closure**, select the Guarantee Number, enter the Account Closure Date, and verify zero outstanding balance in CBS.
2. **Claim Settled & Concluded**: Handled automatically following final claim processing.
3. **Voluntary Pre-closure**: If borrower offers tangible collateral or opts out of CGTMSE coverage, select 'Voluntary Opt-Out' and submit Checker authorization.

### Why can I not close a guarantee?
Closure attempts fail in GMS if:
- **Active Claim in Process**: A claim is actively pending resolution.
- **Outstanding Fees**: Unpaid AGF demands pending on the guarantee.
- **Pending Recoveries**: Recoveries collected from the borrower have not been remitted to CGTMSE.
- **Status Mismatch**: The account is still flagged as active with a positive balance in the latest portfolio upload.

### How do I check guarantee closure status?
Go to **Search & Enquiry > Guarantee Search**:
- Filter status by **'Closed'**.
- The record displays Closure Date, Closure Type (Repaid / Claim Settled / Opt-out), and downloadable Closure Certificate.


## Search & Enquiry

### How do I search by Guarantee Number?
1. In the top navigation bar or under **Search & Enquiry > Direct Search**, locate the 'Guarantee Number (CGPAN)' input field.
2. Enter the alphanumeric Guarantee ID and press Enter.
3. GMS instantly opens the master dossier for the guarantee.

### How do I search for a guarantee by borrower?
Go to **Search & Enquiry > Advanced Search**:
- Input **Borrower Name**, **PAN Number**, or **Udyam Registration Number**.
- GMS displays all guarantees issued across branches for that borrower entity.

### How do I search claims by status?
Navigate to **Claims > Claim Search & MIS**:
- Use the 'Claim Status' dropdown to filter by: 'Lodged', 'Deficiency Pending', 'Approved', 'Rejected', or 'Settled'.
- Select Date Range or Branch Code and export results to Excel.

### How do I view the complete history of a guarantee?
Open any guarantee record and select the **'Lifecycle History / Audit Trail'** tab:
- Displays a chronological timeline: Application Date -> Approval Date -> Fee Payment Dates -> Amendments -> NPA Marking -> Legal Updates -> Claim History -> Closure.

### How do I identify the last action performed on a claim?
In **Claims > Claim Status Tracker**:
- Check the 'Last Activity' column.
- Shows the timestamp, User ID, and action description (e.g., 'Deficiency Raised by CGTMSE', 'Clarification Submitted by MLI Maker', 'Checker Authorized').


## Reports & Downloads

### How do I generate a guarantee report?
1. Navigate to **Reports > Guarantee Portfolio Reports**.
2. Select criteria: Financial Year, Scheme, Branch/Region, Status (Active/Closed/NPA).
3. Choose format: Excel (.xlsx), CSV, or PDF.
4. Click **'Generate Report'**.

### How do I generate a claim report?
1. Navigate to **Reports > Claims Reports**.
2. Filter by: 1st Installment vs Final Claims, Settlement Period, Status, or Delinquency Bucket.
3. Click 'Export to Excel' to analyze claims submitted, settled amounts, and recovery remittances.

### How do I download a GMS report?
When a report is generated, click the **'Download'** button or navigate to **Reports > Download Queue** for large background reports.
- Files are saved directly to your local computer.
- All downloads are encrypted and include digital generation timestamps for banking compliance.

### How do I identify pending claims?
Go to **Reports > Actionable Pending MIS > Pending Claims**:
- Lists all claims categorized by bottleneck: 'Pending MLI Checker Approval', 'Pending CGTMSE Scrutiny', or 'Pending Deficiency Response by Bank'.


## Bulk Processing

### What is bulk processing in GMS?
Bulk Processing enables Member Lending Institutions to perform high-volume operations via batch file uploads instead of single data entry:
- **Supported Operations**: Bulk Guarantee Lodgement, Bulk NPA Marking, Bulk Fee Reconciliation, and Bulk Portfolio Status Updates.
- Utilizes standardized CSV or Excel templates with strict column headers and automated data validation.

### What should I do when a bulk file is rejected?
If a bulk upload file is rejected:
1. Go to the Bulk Upload History log.
2. Check if the error is **File-Level** (e.g., incorrect template header, wrong file format, file size exceeding limit, or corrupt encoding).
3. Ensure the file is saved as standard UTF-8 CSV.
4. Correct formatting and re-upload.

### How do I identify the reason for a failed bulk record?
1. In **Bulk Processing > Upload History**, locate your batch and click **'Download Error Log'**.
2. The downloaded spreadsheet displays each failed record alongside the exact error column (e.g., 'Row 14: Invalid Udyam Number', 'Row 23: Aggregate PAN exposure > ₹500L').
3. Fix the specific rows in the file.

### Can I upload the same bulk file again?
Do NOT re-upload the entire original file without editing, as valid records may trigger duplicate warnings.
- **Recommended Process**: Isolate only the failed rows from the Error Log, correct the discrepancies, save as a new revision file, and upload the corrected subset.


## Common Functional Issues

### Why is my record not visible after submission?
If a submitted record does not immediately appear in the active view:
1. **Maker-Checker Workflow**: The record is likely residing in the Checker Authorization queue awaiting approval.
2. **Asynchronous Batch Sync**: High-volume transactions and bulk uploads process in the background and may take a few minutes to index.
3. **Filter Settings**: Ensure your search filter date range or branch code matches the submitted record.

### Why am I getting a mandatory-field validation error?
Mandatory-field errors occur when required fields marked with an asterisk (*) are empty or contain improper data formats:
- Check: Entity PAN, Udyam Registration Number, Sanction Date, Loan Tenure, PIN Code, or Social Category.
- Ensure there are no leading/trailing blank spaces in text boxes.

### Why am I getting a business-rule validation error?
Business-rule errors indicate that data violates CGTMSE statutory policies:
- Total borrower credit exposure exceeds ₹500 lakh across banking institutions.
- Sanction date is prior to permissible window.
- Guarantee fee calculation mismatch or attempting to enhance limits on an NPA account.
Review the policy guidelines for the specific scheme to resolve the violation.

### What should I do if GMS is slow or a transaction times out?
During peak hours (e.g., financial year-end or fee demand cycles):
1. Do NOT click the submit button repeatedly to prevent duplicate requests.
2. Check **Search & Enquiry** before retrying to verify if the previous transaction was processed.
3. Clear browser cache and cookies or switch to an incognito window.
4. Ensure your network allows uninterrupted access to CGTMSE secure domains.

### What should I do if GMS shows an incorrect business result?
If fee calculations, coverage percentages, or claim figures appear incorrect:
1. Verify input data (e.g., Social category for women/SC/ST concession, or facility type for retail trade).
2. If input data is accurate but computation deviates from official circulars, capture screenshots and download the calculation sheet.
3. Escalate the issue to your MLI Central Nodal Officer or log a ticket on the CGTMSE Technical Support Portal with the Guarantee Reference Number.

### What is the complete GMS journey from guarantee lodgement to claim settlement and closure?
The complete operational lifecycle in GMS comprises 6 seamless phases:
1. **Lodgement & Approval**: Bank Maker enters borrower Udyam/PAN and facility details -> Bank Checker authorizes -> GMS generates Guarantee Number (CGPAN).
2. **Fee Invoicing & Coverage**: Annual Guarantee Fee (AGF) demand generated -> Bank remits fee -> Guarantee status becomes 'Active / In-Force'.
3. **Servicing & Maintenance**: Annual renewal fee paid each year -> Amendments recorded for limit enhancement or tenure extension.
4. **Default & NPA Marking**: If borrower defaults (>90 days overdue), account marked NPA in GMS -> Mandatory legal recovery action (SARFAESI/DRT/Lok Adalat) initiated.
5. **Claim Settlement**: After 18-month lock-in, Bank lodges 1st Claim (75%) -> CGTMSE scrutinizes & disburses 75% -> Post-NPA recoveries shared pro-rata -> Legal proceedings conclude -> Bank lodges Final Claim (remaining 25%).
6. **Closure**: Loan repaid in full by borrower (Normal Closure) or finalized post-claim recovery settlement -> Guarantee marked 'Closed'.
