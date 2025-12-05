"use client";

import React from 'react';
import { Container } from '@mui/material';

const TermsConditionsPage = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="container">
          <header>
            <h1>Terms and Conditions of Use – EncodeBiz Platform</h1>
            <p><strong>Last updated:</strong> October 8, 2025</p>
          </header>

          <main>

            <section>
              <h2>1. Identification of the Service Provider</h2>
              <p>
                EncodeBiz Platform is operated by ENCODEBIZ SL, located at CALLE ALONDRA, 3. 28025 MADRID, Spain.  
                Contact email: <a href="mailto:support@encodebiz.com">support@encodebiz.com</a>.
              </p>
              <p>
                These Terms and Conditions govern the access and use of the EncodeBiz platform, available at 
                <a href="https://saas.encodebiz.com" target="_blank"> https://saas.encodebiz.com</a>,
                as well as its associated services offered under a Software as a Service (SaaS) model.
              </p>
            </section>

            <section>
              <h2>2. Purpose</h2>
              <p>
                These Terms and Conditions set forth the rules that govern the use of the EncodeBiz platform, its 
                services and features, and the rights and obligations of both the platform provider and its users, 
                whether registered or not.
              </p>
            </section>

            <section>
              <h2>3. Service Description</h2>
              <p>
                EncodeBiz provides a digital environment consisting of SaaS solutions for operational management, 
                record administration, and issuance/validation of digital credentials.
              </p>
              <p>The platform currently includes two main services:</p>
              <ul>
                <li><strong>CheckBiz:</strong> management and control of attendance (employees, projects, schedules, check-ins, etc.).</li>
                <li><strong>PassBiz:</strong> issuance and validation of digital passes compatible with Apple Wallet and Google Wallet.</li>
              </ul>
              <p>
                EncodeBiz is intended for companies, institutions, event organizers, educational centers, sports facilities, 
                and other professionals who need to digitize attendance control processes, credential issuance, or access validation.
              </p>
            </section>

            <section>
              <h2>4. Conditions of Access and Use</h2>
              <ul>
                <li>Access to EncodeBiz requires the creation of an organization account by the responsible user.</li>
                <li>The service is restricted to users of legal age and with legal capacity to enter into contracts.</li>
                <li>Users agree to use the services in compliance with applicable laws, ethical principles, public order, and these Terms.</li>
                <li>Use of the platform for unlawful purposes or in ways that may cause harm to the provider or third parties is strictly prohibited.</li>
              </ul>
            </section>

            <section>
              <h2>5. User Registration</h2>
              <p>
                To access personalized services within EncodeBiz, users must register through the designated form, providing true, 
                updated, and complete information.
              </p>
              <p>
                Each account is personal and non-transferable. Users are responsible for maintaining the confidentiality 
                of their login credentials.
              </p>
            </section>

            <section>
              <h2>6. Service Model and Pricing</h2>
              <p>EncodeBiz operates under a SaaS model offering:</p>
              <ul>
                <li>Free plans with basic access.</li>
                <li>Paid or pay-per-use plans providing advanced features, technical support, and increased capacity.</li>
              </ul>
              <p>
                The platform provider reserves the right to modify pricing plans and conditions. Any changes affecting 
                existing subscriptions will be communicated to active users beforehand.
              </p>
            </section>

            <section>
              <h2>7. User Responsibility</h2>
              <p>
                Users are responsible for the content they upload or register on the platform, as well as for the actions 
                of authorized members within their organization.
              </p>
              <p>
                The provider shall not be liable for damages arising from improper, illegal, or unauthorized use of the services.
              </p>
            </section>

            <section>
              <h2>8. Intellectual Property</h2>
              <p>
                All content, trademarks, structures, functionalities, and source code of EncodeBiz are the property of the provider 
                or are used under the corresponding license.
              </p>
              <p>
                Reproduction, distribution, modification, or exploitation of protected elements without explicit written permission 
                is strictly prohibited.
              </p>
            </section>

            <section>
              <h2>9. Personal Data Protection</h2>
              <p>
                EncodeBiz collects and processes personal data in compliance with the General Data Protection Regulation (GDPR) 
                for EU users and any locally applicable privacy regulations.
              </p>
              <p>
                Personal data collected may include identification data, activity logs, and operational information related to 
                platform usage.
              </p>
              <p>
                Full details about data processing are available in the Privacy Policy provided on the website.
              </p>
            </section>

            <section>
              <h2>10. Language</h2>
              <p>
                These Terms and Conditions are available in Spanish and English. In case of discrepancies between versions, 
                the Spanish version shall prevail unless otherwise required by applicable law.
              </p>
            </section>

            <section>
              <h2>11. Modifications</h2>
              <p>
                The provider may modify these Terms at any time. Changes will be communicated to users through platform notices 
                or via email to the registered address.
              </p>
              <p>
                Continued use of the services after modifications implies full acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2>12. Duration and Termination</h2>
              <p>
                These Terms remain in effect as long as the user maintains an active account. Accounts may be cancelled at any time 
                through the user dashboard.
              </p>
              <p>
                The provider reserves the right to suspend or delete accounts for violations of these Terms or improper use of the service.
              </p>
            </section>

            <section>
              <h2>13. Applicable Law and Jurisdiction</h2>
              <p>
                Unless otherwise required by applicable regulations, these Terms shall be governed by the laws of the country 
                where the platform provider resides.
              </p>
              <p>
                Both parties submit to the competent courts of that location for the resolution of any disputes arising from 
                the use of the service.
              </p>
            </section>

            <section>
              <h2>14. Contact</h2>
              <p>
                For any questions regarding these Terms and Conditions, you may contact us at:<br />
                <a href="mailto:support@encodebiz.com">support@encodebiz.com</a><br />
                <a href="https://saas.encodebiz.com" target="_blank">https://saas.encodebiz.com</a>
              </p>
            </section>

          </main>
        </div>
      </Container>
    </>
  );
};

export default TermsConditionsPage;
