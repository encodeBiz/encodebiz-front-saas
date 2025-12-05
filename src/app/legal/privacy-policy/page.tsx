'use client'
import React from 'react';
import { Container } from '@mui/material';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <h1>Privacy Policy</h1>
        <p><em>Last Updated: December 5, 2025</em></p>

        <p>
          This Privacy Policy is provided in accordance with Regulation (EU) 2016/679 (General Data Protection Regulation – GDPR) 
          and the Spanish Organic Law 3/2018 on the Protection of Personal Data and Guarantee of Digital Rights (LOPDGDD). 
          It applies to users of ENCODEBIZ SL SaaS services (CheckBiz, PassBiz), the corporate website, and associated platforms.
        </p>

        <h2>1. Data Controller</h2>
        <p>The entity responsible for processing your personal data is:</p>
        <ul>
          <li><strong>Company:</strong> ENCODEBIZ SL</li>
          <li><strong>Tax ID:</strong> B24873275</li>
          <li><strong>Address:</strong> Calle Alondra 3, 28025 Madrid, Spain</li>
          <li><strong>Email:</strong> jose@encodebiz.com</li>
          <li><strong>Website:</strong> https://www.encodebiz.com</li>
        </ul>

        <h2>2. Information We Collect</h2>

        <h3>2.1 Information Provided Directly by the User</h3>
        <ul>
          <li>Full name</li>
          <li>Identification documents (ID / NIE / Passport)</li>
          <li>Email and mailing address</li>
          <li>Phone number</li>
          <li>Academic and professional background</li>
          <li>Curriculum vitae for recruitment purposes</li>
        </ul>

        <h3>2.2 Automatically Collected Data</h3>
        <ul>
          <li>Activity logs within the platform</li>
          <li>Work-hour logs (check-in and check-out)</li>
          <li>IP address, browser type, operating system</li>
          <li>Technical device and performance information</li>
        </ul>

        <h3>2.3 Location Data</h3>
        <p>
          CheckBiz and PassBiz use <strong>precise and approximate location data</strong> only when required for essential functionalities:
        </p>
        <ul>
          <li>Validating employee presence within authorized work areas</li>
          <li>Preventing fraud in legally required time-tracking processes</li>
          <li>Generating internal anonymized performance insights</li>
        </ul>

        <p>
          Location data is <strong>never used for advertising</strong> nor shared with third parties except strict technical providers 
          acting under Data Processing Agreements (DPAs).
        </p>

        <p>
          Location access is activated only when the user performs an action requiring validation (check-in, check-out, secure-access event).
          The applications do not collect location data in the background unless explicitly required for essential service functionality and with user consent.
        </p>

        <h2>3. Responsibility Over Employee Data (CheckBiz & PassBiz)</h2>
        <p>
          ENCODEBIZ SL acts as a <strong>Data Processor</strong> for all employee data entered into CheckBiz and PassBiz. 
          Each client company acts as the <strong>Data Controller</strong> under GDPR Article 4(7).
        </p>

        <p>The client company is solely responsible for:</p>
        <ul>
          <li>Creating and deleting employee accounts</li>
          <li>Updating, modifying, or removing employee data</li>
          <li>Ensuring the lawfulness and accuracy of all data introduced</li>
          <li>Informing employees about data processing, including geolocation usage</li>
          <li>Obtaining necessary consent from employees when required by law</li>
        </ul>

        <p>
          ENCODEBIZ SL does not create, alter, or delete employee data without documented instructions from the Data Controller 
          and processes such data only according to contractual obligations.
        </p>

        <h2>4. Purpose of Data Processing</h2>
        <p>Your personal data may be processed for the following purposes:</p>
        <ul>
          <li>Providing and maintaining the contracted SaaS services</li>
          <li>Managing commercial and contractual relationships</li>
          <li>Preparing tailored quotations</li>
          <li>Managing communication with users and clients</li>
          <li>Carrying out recruitment processes</li>
          <li>Managing human resources internally</li>
          <li>Sending commercial information related to software development</li>
          <li>Location-based validation of work-time records (CheckBiz)</li>
          <li>Identity and access validations (PassBiz)</li>
          <li>Delivering and managing training activities</li>
        </ul>

        <h2>5. Legal Basis for Processing</h2>
        <ul>
          <li><strong>Contract execution</strong> (Article 6.1.b GDPR)</li>
          <li><strong>User consent</strong> (Article 6.1.a GDPR)</li>
          <li><strong>Legitimate interest</strong> (Article 6.1.f GDPR)</li>
          <li><strong>Legal obligation</strong> in labour, and tax compliance</li>
        </ul>

        <h2>6. Data Retention</h2>
        <p>Data will be retained for the duration of the contractual relationship and according to the following legal periods:</p>

        <ul>
          <li><strong>Identification data:</strong> while the relationship remains active or until consent is withdrawn.</li>
          <li><strong>Labour, payroll, and work-hour records:</strong> 4–5 years depending on applicable legislation.</li>
          <li><strong>Tax and accounting documentation:</strong> 4–6 years.</li>
          <li><strong>Occupational risk prevention documentation:</strong> 5 years.</li>
          <li><strong>Anti-money laundering obligations:</strong> 10 years.</li>
          <li><strong>Recruitment processes:</strong> 2 years from CV submission.</li>
          <li><strong>Anonymized data:</strong> retained indefinitely (non-identifiable).</li>
        </ul>

        <p>
          Location data is stored only for the time required to validate user operations and may be anonymized for analytics.
        </p>

        <h2>7. Data Sharing</h2>
        <p>
          Personal data will not be sold or shared with third parties except:
        </p>
        <ul>
          <li>Technical providers (hosting, cloud, security services, Google/Firebase)</li>
          <li>Payment processors</li>
          <li>Administrative and accounting services</li>
          <li>Courier and delivery companies when required</li>
          <li>Subcontractors operating strictly under confidentiality and data-processing agreements</li>
        </ul>

        <p>
          All data transfers are carried out under GDPR, ensuring adequate safeguards, contractual commitments, and security measures.
        </p>

        <h2>8. Origin of the Data</h2>
        <p>Your personal data may originate from:</p>
        <ul>
          <li>The user directly</li>
          <li>Your employer (client company of ENCODEBIZ SL)</li>
          <li>Group companies or collaborators</li>
        </ul>

        <h2>9. User Rights</h2>
        <p>Under Articles 15–22 GDPR, users may request:</p>
        <ul>
          <li>Access to their data</li>
          <li>Rectification of inaccurate data</li>
          <li>Erasure (“right to be forgotten”)</li>
          <li>Restriction of processing</li>
          <li>Objection to processing</li>
          <li>Data portability</li>
        </ul>

        <p>
          Requests may be submitted to: <strong>jose@encodebiz.com</strong>  
          or via postal address: Calle Alondra 3, 28025 Madrid, Spain.
        </p>

        <p>
          Users may also file a complaint with the Spanish Data Protection Authority (AEPD): https://www.aepd.es
        </p>

        <h2>10. Security Measures</h2>
        <p>
          ENCODEBIZ SL applies technical and organizational measures to ensure the confidentiality, integrity, and availability 
          of all processed data, including:
        </p>
        <ul>
          <li>SSL/TLS encryption</li>
          <li>Restricted-access controls</li>
          <li>Secure servers located within the EU/EEA</li>
          <li>Continuous monitoring and security auditing</li>
        </ul>

        <h2>11. Social Media</h2>
        <p>
          The company maintains profiles on major social networks (e.g., Facebook, Instagram). Data processing on these platforms 
          follows the legal terms established by each provider.
        </p>

        <h2>12. Confidentiality and Data Accuracy</h2>
        <p>
          All information provided by users will be treated as confidential. Users are responsible for ensuring that all data supplied is accurate and up to date.
        </p>

        <h2>13. Policy Updates</h2>
        <p>
          This Privacy Policy may be updated to reflect legal or technological changes. The most recent version will always be available on this page.
        </p>

        <h2>14. Supervisory Authority</h2>
        <p>
          If you believe your rights have been violated, you may file a complaint with:
        </p>
        <p><strong>Spanish Data Protection Authority (AEPD)</strong><br/>
        C/ Jorge Juan 6, 28001 Madrid – https://www.aepd.es</p>

      </Container>
    </>
  );
};

export default PrivacyPolicyPage;
