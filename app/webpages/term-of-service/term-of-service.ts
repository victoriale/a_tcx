import {Component, OnInit, HostListener, Renderer} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";

@Component({
  selector: 'term-of-service',
  templateUrl: 'app/webpages/term-of-service/term-of-service.html',
})

export class TermOfService implements OnInit{
  aboutUsData: any;

  currentUrl: string = window.location.href;

  socialMedia:Array<any> = GlobalSettings.getSocialMedia(this.currentUrl);

  scrollTopPrev:number = 0;

  constructor(private _render:Renderer){
      window.scrollTo(0, 0);
  }

  ngOnInit(){
    this.aboutUsData = {
      title: "Terms of Service",
      lastUpdated: "Last Updated On: Wednesday, Nov. 02, 2016",
      paragraph: [{
          subHeader: "Central Terms of Service",
          info: ['THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A WAIVER OF CLASS ACTION RIGHTS AS DETAILED IN THE MANDATORY ARBITRATION AND CLASS ACTION WAIVER SECTION BELOW']
        },{
          subHeader: "Acceptance of the Terms of Service",
        },{
          subHeader: 'READ THESE TERMS OF SERVICE CAREFULLY. THEY ARE A LEGAL CONTRACT GOVERNING YOUR USE OF THE SITE PROVIDED BY SNT MEDIA AND ITS SUBSIDIARIES AND AFFILIATES (collectively, "SNT Media," "we," or "us," or "our").',
          info: ['These Terms of Service (TOS or Terms) govern your access to and use of the website, mobile application or other online service where these Terms are posted (collectively, the Site). By clicking an Accept, Register or similar button or icon, connecting to the Site through a third party such as Facebook or by using the Site in any manner, you agree to be bound to these Terms and our Privacy Policy, whether you registered with the Site. The Site reserves the right to deny access to any person who violates these Terms.']
        },{
          subHeader: 'Copyright',
          info: ['All information, content, services and software displayed on, transmitted through, or used in connection with the Site (with the exception of User Content as defined below), including, for example, news articles, reviews, directories, guides, text, photographs, images, illustrations, audio clips, video, html, source and object code, trademarks, logos, and the like (collectively, the "Content"), as well as its selection and arrangement, is owned by SNT Media and/or its licensors and suppliers. You may use the Content online only, and solely for your personal, non-commercial use, and you may download or print a single copy of any portion of the Content solely for your personal, non-commercial use, provided you do not remove any trademark, copyright or other notice from such Content. If you operate a website and wish to link to the Site, you may do so provided you agree to cease such link upon request from the Site. No other use is permitted without prior written permission of the Site. The permitted use described in this section is contingent on your compliance at all times with these Terms.', 'You may not republish any portion of the Content on any Internet, Intranet, extranet site or any other publication, or incorporate the Content in any database, compilation, archive, cache, or similar medium. You may not distribute any Content to others, whether or not for payment or other consideration, and you may not archive, modify, copy, frame, cache, reproduce, sell, publish, transmit, display or otherwise use any portion of the Content. You may not scrape or otherwise copy our Content without our permission. You agree not to decompile, reverse engineer or disassemble any software or other products or processes accessible through the Site nor to insert any code or product or manipulate the Content or the Site in any way, and not to use any data mining, data gathering or extraction method.']
        },{
          subHeader: 'Requests to use Content for any purpose other than as permitted in these Terms should be directed to any of the email addresses provided in the Contact Us section',
          info: ['In certain cases, you may be able to use individual stories that appear on the Site through online functionality we have specifically designated (e.g., to e-mail a story to a friend or to purchase the rights to reproduce a story for other use). In such cases, we will tell you directly in the portion of the Content you may use or you will see a link in the Content itself that will permit you to email the story or purchase the rights to reproduce it.']
        },{
          subHeader: 'User Content Representations and Warranties',
          info: ['By placing material on the Site, including but not limited to posting content or communications to any Site bulletin board, forum, blogspace, message or chat area, or posting text, images, audio files or other audio-visual content to the Site (collectively, "User Content"), you represent and warrant: (1) you own or otherwise have all necessary rights to the User Content you provide and the rights to provide it under these Terms; and (2) the User Content will not cause injury to any person or entity. Using a name other than your own legal name in association with the submission of User Content is prohibited (except in those specific areas of the Site that may specifically ask for unique, fictitious names).']
        },{
          subHeader: 'User Content License',
          info: ['For all User Content you post, upload, or otherwise make available (in this section - "Provide") to the Site, you grant SNT Media a worldwide, royalty-free, perpetual, irrevocable, non-exclusive right and fully sub-licensable license to use, copy, reproduce, distribute, publish, publicly perform, publicly display, modify, adapt, translate, archive, store, and create derivative works from such User Content, in any form, format, or medium, of any kind now known or later developed. Without limiting the generality of the previous sentence, you authorize SNT Media to: (i) share the User Content across all websites, mobile applications, newspapers and other online services affiliated with SNT Media; (ii) include the User Content in a searchable format accessible by users of the Site and other SNT Media websites, mobile applications, newspapers and other online services; (iii) place advertisements in close proximity to such User Content; and (iv) use your name, likeness and any other information in connection with our use of the material you provide. You waive all moral rights with respect to any User Content you Provide to the Site. You also grant SNT Media the right to use any material, information, ideas, concepts, know-how or techniques contained in any communication you Provide or otherwise submit to us for any purpose whatsoever, including but not limited to, commercial purposes, and developing, manufacturing and marketing commercial products using such information. All rights in this section are granted without the need for additional compensation of any sort by SNT Media to you.']
        },{
          subHeader: 'Unsolicited Material and Ideas',
          info: ['We are happy to hear from our users and welcome feedback regarding our Site. The Site is not responsible for the similarity of any of its content or programming in any media to materials or ideas provided to the Site. If you do transmit unsolicited submissions to us through the Site or otherwise, you acknowledge that such submissions become the property of SNT Media and may be adapted, broadcast, changed, copied, disclosed, licensed, performed, posted, published, sold, transmitted, or otherwise used as SNT Media sees fit. By using the Site and transmitting an unsolicited submission to us, you agree that you are not entitled to any compensation, credit or notice whatsoever with respect to such submission, and that by sending an unsolicited submission you waive the right to make any claim against the Site, SNT Media and its parents, officers or directors relating to our use of such submission, including, without limitation, infringement of proprietary rights, unfair competition, breach of implied contract or breach of confidentiality, even if material or an idea is used that is or may be substantially similar to the idea you sent.']
        },{
          subHeader: 'User Content Screening and Removal',
          info: ['You acknowledge that the Site and/or its designees may or may not pre-screen User Content, and shall have the right (but not the obligation), in their sole discretion, to move, remove, block, edit, or refuse any User Content for any reason, including without limitation that such User Content violates these Terms or is otherwise objectionable.']
        },{
          subHeader: 'User Content Assumption of Risk',
          info: ['Although the Site may from time to time monitor or review postings, transmissions, and the like on the Site, it cannot and does not monitor or manage all User Content, and does not guarantee the accuracy, integrity, or quality of User Content. All User Content provided to the Site is the sole responsibility of the person who provided it. <b>This means that you are entirely responsible for all User Content that you provide.</b> To protect your safety, please use your best judgment when using Site forums, chat rooms, bulletin boards, blogs or similar features. We discourage divulging personal phone numbers and addresses or other information that can be used to identify or locate you. You acknowledge and agree that if you make such disclosures either through posting on any bulletin board, forum, blogspace, message or chat area, or uploading text, images, audio files or other audio-visual content, in classified advertising you place or in other interactive areas, or to third parties in any communication, you do so fully understanding that such information could be used to identify you']
        },{
          subHeader: 'User Content Posting Rules',
          info: ["Any decisions as to whether User Content violates any posting rule set forth in these Terms will be made by the Site in its sole discretion and after we have actual notice of such posting. When you provide User Content, you agree to the following rules:", "<ul class='tos-space'><li>If the photo or video depicts any children under the age of 13, you affirm that you have written permission from the child's parent or guardian to provide the photo or video.</li><br><li>Do not provide User Content that:</li><br><ul class='tos-space-2'><li>contains copyrighted or other proprietary material of any kind without the express permission of the owner of that material;<br>contains vulgar, profane, abusive, racist or hateful language, expressions, epithets, slurs, text, photographs or illustrations, or is in poor taste, or is an inflammatory attack of a personal, racial or religious nature;<br>is defamatory, threatening, disparaging, grossly inflammatory, false, misleading, fraudulent, inaccurate, unfair, contains gross exaggeration or unsubstantiated claims, violates the privacy rights of any third party, is unreasonably harmful or offensive to any individual or community;<br>may cause any harm or damage to the Site, you, us, or anyone else;<br>violates any right of the Site, SNT Media or any third party;</li><br><li>infringes other individuals’ privacy rights or rights of publicity;<br>discriminates on the grounds of race, religion, national origin, gender, age, marital status, sexual orientation or disability, or refers to such matters in any manner prohibited by law.</li><br><li>violates or encourages the violation of any municipal, state, federal or international law, rule, regulation, ordinance, or similar requirement;</li><br><li>interferes with any third party's use of the Site;advertises, promotes or offers to trade any goods or services, except in areas specifically designated for such purpose;</li><br><li>collects any user content or information, or otherwise accesses the Site using automated means (such as harvesting bots, robots, spiders, or scrapers) without our prior permission;</li><br><li>violates any robot exclusion headers of the Site, if any, or bypasses or circumvents other measures employed to prevent or limit access to the Site;shares, recompiles, decompiles, disassembles, reverse engineers, or makes or distributes any other form of, or any derivative work from, the Site;<br>attempts to scrape or collect any personal or private information from other users or from the Site;</li><br><li>pretends to come from someone other than you, or where you are impersonating someone else;<br>intercepts or monitors, damages, or modifies any communication not intended for you;<br>uses or attempt to use another's registration account, password, service or system except as expressly permitted by the Terms;<br> uploads or transmits viruses or any other harmful, disruptive or destructive files, materials or code;</li><br><li>disrupts, interferes with, or otherwise harms or violates the security of the Site, or any services, system resources, accounts, passwords, servers or networks connected to or accessible through the Site or affiliated or linked sites;</li><br><li> 'flames' any individual or entity (e.g., sends repeated messages related to another user and/or makes derogatory or offensive comments about another individual), or repeats prior posting of the same message under multiple threads or subjects; or<br>otherwise breaches these Terms.</li></ul></ul>"]
        },{
          subHeader: 'WARNING: A VIOLATION OF THESE POSTING RULES MAY BE REFERRED TO LAW ENFORCEMENT AUTHORITIES.',
          info: ['You shall notify us immediately upon becoming aware of the commission by any person of any restricted uses of the Site by using the email addresses provided in the Contact Us section and shall provide us with reasonable assistance in any investigations we conduct in light of the information you provide in this respect.', 'You acknowledge that we have no obligation to monitor your access to or use of the Site, or to review or edit any Content, but we have the right to do so: (i) for the purpose of operating and improving the Site (including without limitation for fraud prevention, risk assessment, investigation and customer support purposes); (ii) to ensure your compliance with these Terms; (iii) to comply with applicable law or the order or requirement of a court, administrative agency or other governmental body; or (iv) to respond to content that we determine is otherwise objectionable or violates these Terms. We reserve the right, at any time and without prior notice, to remove or disable access to any Content that we, in our sole discretion, consider to be objectionable for any reason, in violation of these Terms, otherwise harmful to the Site, or for any other reason that we deem appropriate. In order to protect the integrity of the Site, we also reserve the right at any time in our sole discretion to block users from certain IP addresses from accessing and using the Site.', 'You acknowledge, consent, and agree that we may access, preserve and disclose any of your information if we are required to do so by law, or if we believe in good faith that it is reasonably necessary: (i) to respond to claims asserted against us or to comply with legal process (for example, subpoenas or warrants); (ii) to enforce or administer our agreements with users, including without limitation the TOS; (iii) to render services you request; (iv) to protect the rights or property of the Site, SNT Media, and their respective third-party suppliers and licensors; (v) for fraud prevention, risk assessment, investigation, customer support, product development and de-bugging purposes; (vi) to protect the rights, property or safety of the Site, its users, or members of the public; or (vii) in circumstances that we deem, in our sole discretion, to pose a threat to the safety of us, you or others.']
        },{
          subHeader: 'Transactions and E-Commerce',
          info: ['During your visit to the Site, you may elect to engage in a transaction involving the purchase of a product such as a newspaper subscription, a print or online advertisement or other tangible goods and services. Credit card transactions and order fulfillment are often handled by a third-party processing agent, bank or distribution institution. While in most cases transactions are completed without difficulty, there is no such thing as perfect security on the internet or offline. If you are concerned about online credit card safety, in most cases a telephone number will be made available so you can call us and place your order by phone. The Site cannot and does not take responsibility for the success or security of transactions undertaken or processed by third parties.']
        },{
          subHeader: 'Linked Sites',
          info: ['If we provide links to other websites, you should not infer or assume that we operate, control, or are otherwise connected with these other websites. Please be careful to read the applicable terms and conditions and privacy policy of any other website before you provide any personal information or engage in any transactions. We are not responsible for the content or practices of any website not part of the Site, even if the website is operated by a company affiliated or otherwise connected with us. By using the Site, you acknowledge and agree that we are not responsible or liable to you for any content or other materials hosted, served, or residing on the domain from any websites other than the Site and then only to the extent provided for herein.', 'During your visit to the Site, you may link to, or view as part of a frame, certain content that is actually created, hosted and/or licensed by a third party. Because the Site has no control over third-party sites and resources, you acknowledge and agree that the Site is not responsible for the availability of external websites or resources, nor for the content, actions, or policies of those sites. Information you provide on such websites, including personal information and transactional information, is subject to the terms of service of those websites.']
        },{
          subHeader: 'Errors in Advertisements',
          info: ['On occasion, a product or service may not be available at the time or the price as it appears in an advertisement or other material in the Site. In such event, or in the event a product is listed at an incorrect price or with incorrect information due to typographical error, technology error, error in the date or length of publication, error in pricing or product information received from our advertisers or suppliers, or for any other reason, you agree the Site is not responsible for such errors or discrepancies.']
        },{
          subHeader: 'Communications with Third Parties Through the Site',
          info: ["Your dealings or communications through the Site with any party other than SNT Media are solely between you and that third party. For example, certain areas of the Site may allow you to conduct transactions or purchase goods or services. In most cases, these transactions will be conducted by our third-party partners and vendors. Under no circumstances will the Site be liable for any goods, services, resources or content available through such third-party dealings or communications, or for any harm related thereto. Please review carefully that third party's policies and practices and make sure you are comfortable with them before you engage in any transaction. Complaints, concerns or questions relating to materials provided by third parties should be directed to the third party."]
        },{
          subHeader: 'Notice of Intellectual Property Infringement',
          info: ["In accordance with the Digital Millennium Copyright Act (DMCA) and other applicable law, it is the policy of the Site, in appropriate circumstances, to terminate the registration account of a member who is deemed to infringe third-party intellectual property rights or to remove User Content that is deemed to be infringing. If you believe that your work has been copied in a way that constitutes copyright infringement and is displayed on the Site, please provide substantially the following information to our support department (please consult your legal counsel or see 17 U.S.C. Section 512(c)(3) to confirm these requirements):", "<ol class='tos-space'>1.	an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest;<br>2.	a description of your copyrighted work or other intellectual property that you claim has been infringed;<br>3.	a description of where the material you claim is infringing is located on the Site (providing us with website URL is the quickest way to help us locate content quickly);<br>4.	your address, telephone number, and email address;<br>5.	a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;<br>6.	a statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright or intellectual property owner or authorized to act on the copyright or intellectual property owner's behalf.</ol>", "For inquiries or questions, use the information listed in the Contact Us section below. Please also note that, pursuant to Section 512(f) of the Copyright Act, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability."]
        },{
          subHeader: 'General Disclaimer and Limitation of Liability',
          info: ['While the Site and SNT Media use reasonable efforts to include accurate and up-to-date information, neither the Site nor SNT Media make any warranties or representations as to the accuracy of the Content and assume no liability or responsibility for any error or omission in the Content. The Site and SNT Media do not represent or warrant that use of any Content will not infringe rights of third parties. The Site and SNT Media have no responsibility for actions of third parties or for content provided by others, including without limitation User Content.', 'USE OF THE SITE IS AT YOUR OWN RISK. ALL CONTENT AND ACCESS TO THE SITE ARE PROVIDED "AS IS" AND "AS AVAILABLE." NEITHER SNT MEDIA, THE SITE, NOR ANY OF THE SNT MEDIA AND/OR SITE OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, REPRESENTATIVES, CONTRACTORS, AGENTS, CONTENT PROVIDERS OR LICENSORS, MAKE ANY REPRESENTATION OR WARRANTY OF ANY KIND REGARDING THE SITE, THE CONTENT, ANY ADVERTISING MATERIAL, INFORMATION, PRODUCTS OR SERVICES AVAILABLE ON OR THROUGH THE SITE, AND/OR THE RESULTS THAT MAY (OR MAY NOT) BE OBTAINED FROM USE OF THE SITE OR THE CONTENT. ALL EXPRESS OR IMPLIED WARRANTIES, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, WARRANTIES AGAINST INFRINGEMENT, AND WARRANTIES THE SITE WILL MEET YOUR REQUIREMENTS, BE UNINTERRUPTED, TIMELY, SECURE OR ERROR FREE, ARE SPECIFICALLY DISCLAIMED. THE SITE, SNT MEDIA AND THEIR RESPECTIVE OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, REPRESENTATIVES, CONTRACTORS, AGENTS, CONTENT PROVIDERS OR LICENSORS ARE NOT RESPONSIBLE OR LIABLE FOR CONTENT POSTED BY THIRD PARTIES, ACTIONS OF ANY THIRD PARTY, OR FOR ANY DAMAGE TO, OR VIRUS THAT MAY INFECT, YOUR COMPUTER EQUIPMENT, MOBILE DEVICE, OR OTHER PROPERTY. THE SITE CONTAINS FACTS, VIEWS, OPINIONS, STATEMENTS AND RECOMMENDATIONS OF THIRD-PARTY INDIVIDUALS AND ORGANIZATIONS. THE SITE DOES NOT REPRESENT OR ENDORSE THE ACCURACY, CURRENTNESS OR RELIABILITY OF ANY ADVICE, OPINION, STATEMENT OR OTHER INFORMATION DISPLAYED, UPLOADED OR DISTRIBUTED THROUGH THE SITE. ANY RELIANCE UPON ANY SUCH OPINION, ADVICE, STATEMENT OR INFORMATION IS AT YOUR SOLE RISK. IN NO EVENT SHALL THE SITE, SNT MEDIA OR THEIR RESPECTIVE OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, REPRESENTATIVES, CONTRACTORS, AGENTS, CONTENT PROVIDERS OR LICENSORS BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, SPECIAL, INCIDENTAL OR PUNITIVE DAMAGES INCLUDING, WITHOUT LIMITATION, DAMAGES RELATED TO UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA, THE CONTENT OR ANY ERRORS OR OMISSIONS IN THE CONTENT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL THE SITE, SNT MEDIA OR ANY OF THEIR RESPECTIVE OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, REPRESENTATIVES, CONTRACTORS AGENTS, CONTENT PROVIDERS OR LICENSORS BE LIABLE FOR ANY AMOUNT FOR DIRECT DAMAGES IN EXCESS OF THE LESSER OF $100 OR THE AMOUNT YOU PAID TO USE THE SITE.']
        },{
          subHeader: 'Indemnity',
          info: ["You agree to indemnify, defend and hold harmless the Site and SNT Media, as well as each of their respective parent companies, and each of their respective partners, suppliers, licensors, officers, directors, shareholders, employees, representatives, contractors and agents, and sub-licensees from any and all claims (including but not limited to claims for defamation, trade disparagement, privacy and intellectual property infringement) and damages (including attorneys' fees and court costs) in any and all jurisdictions arising from or relating to any allegation regarding: (1) your use of the Site; (2) the Sites and/or SNT Media’s use of any User Content or information you provide, as long as such use is not inconsistent with these Terms; (3) information or material provided through your registration account, even if not posted by you; and (4) any violation of these Terms by you."]
        },{
          subHeader: 'International Users',
          info: ["The Site is controlled, operated and administered by SNT Media from its offices within the United States. The Site and SNT Media make no representation that materials or Content available through the Site are appropriate or available for use outside the United States and access to them from territories where their contents are illegal is prohibited. You may not use the Site or export the Content in violation of U.S. export laws and regulations. If you access the Site from a location outside the United States, you are responsible for compliance with all applicable laws."]
        },{
          subHeader: 'Modifying these Terms',
          info: ["The Site and SNT Media reserve the right to change these Terms at any time in their respective discretion and to notify users of any such changes solely by changing the Effective Date of these Terms. The most current version of these Terms will supersede all previous versions. Your continued use of the Site after the posting of any amended Terms shall constitute your agreement to be bound by any such changes. Your use of the Site prior to the time these Terms were posted will be governed according to the Terms that applied at the time of your use."]
        },{
          subHeader: 'Discontinuation of Service',
          info: ["The Site may modify, suspend, discontinue or restrict the use of any portion of the Site, including the availability of any portion of the Content at any time, without notice or liability. The Site may deny access to any user at any time for any reason, or no reason at all. In addition, the Site or SNT Media may at any time transfer rights and obligations under these Terms to any SNT Media affiliate, subsidiary or business unit, or any of their affiliated companies or divisions, or any entity that acquires SNT Media, the Site or any of their respective assets."]
        },{
          subHeader: 'Statute of Limitations',
          info: ["You agree to file any claim regarding any aspect of this Site or these Terms within six months of the time in which the events giving rise to such claim began, or you agree to waive such claim."]
        },{
          subHeader: 'Disputes',
          info: ["Our Customer Support Department is available at the email addresses provided in the Contact Us section to address any concerns you may have regarding the Site. Our Customer Service Department can resolve most concerns quickly to our customers’ satisfaction. The parties shall use their best efforts to settle any dispute, claim, question, or disagreement directly through consultation with the Customer Support Department and good faith negotiations which shall be a condition to either party initiating a lawsuit or arbitration.", "For any dispute that is not subject to binding arbitration or otherwise as set forth in this Agreement, you and the Site agree to submit to the personal and exclusive jurisdiction of and venue in the federal and state courts located in State of Illinois. You further agree to accept service of process by mail, and hereby waive any and all jurisdictional and venue defenses otherwise available.", "These Terms and the relationship between you and the Site shall be governed by the laws of the State of Illinois without regard to conflict of law provisions."]
        },{
          subHeader: 'MANDATORY ARBITRATION AND CLASS ACTION WAIVER',
          info: ["PLEASE READ THIS ARBITRATION PROVISION CAREFULLY TO UNDERSTAND YOUR RIGHTS. BY ELECTING ARBITRATION, YOU AGREE THAT ANY CLAIM THAT YOU MAY HAVE IN THE FUTURE MUST BE RESOLVED THROUGH BINDING ARBITRATION. YOU WAIVE THE RIGHT TO HAVE YOUR DISPUTE HEARD IN COURT AND WAIVE THE RIGHT TO BRING CLASS CLAIMS. YOU UNDERSTAND THAT DISCOVERY AND APPEAL RIGHTS ARE MORE LIMITED IN ARBITRATION.", "Arbitration is a method of resolving a claim, dispute or controversy without filing a lawsuit. By agreeing to arbitrate, the right to go to court is waived and instead claims, disputes or controversies are submitted to binding arbitration. This provision sets forth the terms and conditions of our agreement. You and SNT Media agree that use of this website and your subscription affect interstate commerce and the Federal Arbitration Act (FAA) applies.", "By using this website, you elect to have disputes resolved by arbitration. You and SNT Media may pursue a Claim. Claim means any dispute between you and SNT Media relating to your use of this website, subscription, or our relationship, including any application, subscription, and any representations, omissions or warranties. You or SNT Media may seek remedies in small claims court without arbitrating to the extent your Claim is subject to the jurisdiction of a small claims court. In addition, either party may bring an action in state or federal court or in the U.S. Patent and Trademark Office to protect its intellectual property rights (intellectual property rights means patents, copyrights, moral rights, trademarks and trade secrets, but not privacy or publicity rights).", "Except as specifically provided herein, all Claims must be resolved by arbitration. You or SNT Media may select arbitration with American Arbitration Association or JAMS, except the arbitrator shall have no authority to find that a Claim is subject to arbitration on a class basis or as part of another representative action. The hearing will be in the federal district where you reside. For residents outside of the United States, arbitration must be initiated in the State of Illinois, United States of America, and you and SNT Media agree to submit to the personal jurisdiction of any federal or state court in Cook County, Illinois, in order to compel arbitration, to stay proceedings pending arbitration, or to confirm, modify, vacate, or enter judgment on the award entered by the arbitrator. If agreed, arbitration may be by telephone or written submissions. Filing and arbitrator fees are to be paid per the sponsor rules. You may contact the sponsor for a fee waiver. If no fee waiver applies, SNT Media will pay all of the actual filing and arbitrator fees for the arbitration, provided your claim does not seek more than $75,000. Each party is responsible for other fees. The arbitrator may award costs or fees to the prevailing party, if permitted by law. SNT Media will not seek fees, unless the claims are frivolous.", "The arbitrator shall be an attorney or current or retired judge. The arbitrator shall follow substantive law, statute of limitations and decide all issues relating to the interpretation, construction, enforceability and applicability of this provision. The arbitrator may order relief permitted by law. This provision is governed and enforceable pursuant to the FAA. An award shall include a written opinion and be final, subject to appeal pursuant to the FAA, and may be entered as a judgment in any court of competent jurisdiction.", "This provision survives termination of your subscription, our relationship, bankruptcy, assignment or transfer. If part of this provision is unenforceable, the remainder remains in effect. AS SET FORTH ABOVE, YOU AND SNT MEDIA AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. If unenforceability allows arbitration as a class action, then this mandatory arbitration provision is entirely unenforceable.", "You have the right to opt out and not be bound by this mandatory arbitration provision by sending written notice of your decision to opt out to support@sntmedia.com with the subject line, Mandatory Arbitration Opt-Out. The notice must be sent within thirty (30) days of the (a) Effective Date of these Terms; or (b) the first date that you agreed to any version of these Terms that contains this version of the mandatory arbitration provision, whichever is earlier. If you opt out of the mandatory arbitration provision, SNT Media also will not be bound by it in its disputes with you.", "SNT Media reserves the right to make changes to this mandatory arbitration provision after providing written notice. Changes will become effective on the sixtieth (60th) day after notice, and will apply prospectively only to claims arising after the sixtieth (60th) day. If a court or arbitrator decides that this section allowing changes is not enforceable or valid, then this subsection shall be severed from the mandatory arbitration provision, and the court or arbitrator shall apply the first mandatory arbitration provision you agreed to."]
        },{
          subHeader: 'General Provisions'
        },{
          subHeader: 'Force Majeure',
          info: ["The failure of the Site to comply with any provision of these Terms due to an act of God, hurricane, war, fire, riot, earthquake, terrorism, act of public enemies, actions of governmental authorities outside of the control of the Site (excepting compliance with applicable codes and regulations) or other force majeure event will not be considered a breach of these Terms."]
        },{
          subHeader: 'Severability',
          info: ["If for any reason any provision of these Terms is found unenforceable, that provision shall be enforced to the maximum extent permissible so as to effect the intent of the parties as reflected in that provision, and the remainder of these Terms shall continue in full force and effect."]
        },{
          subHeader: 'No Waiver',
          info: ["Any failure of the Site to enforce or exercise any provision of this TOS or related right shall not constitute a waiver of that right or provision."]
        },{
          subHeader: 'No Third-Party Beneficiaries',
          info: ["You agree, except as expressly provided in these Terms, there shall be no third-party beneficiaries to these Terms."]
        },{
          subHeader: 'Section Titles',
          info: ["The section titles used in these Terms are purely for convenience and carry with them no legal or contractual effect."]
        },{
          subHeader: 'Termination',
          info: ["In the event of termination of these Terms for any reason, you agree the following provisions will survive: the provisions regarding limitations on your use of Content, the license(s) you have granted to the Site, the Disputes provisions, and all other provisions for which survival is equitable or appropriate."]
        },{
          subHeader: 'Conflicts',
          info: ["In the case of a conflict between these Terms and the terms of any electronic or machine readable statement or policy, these Terms shall control. Similarly, in case of a conflict between these Terms and our Privacy Policy, these Terms control."]
        },{
          subHeader: 'No Joint Venture, Partnership, or Agency Relationship',
          info: ["No joint venture, partnership or agency relationship exists between you and the Site. These Terms, our Privacy Policy, any uses of the Site by You, and any information, products, or services provided by the Site to you do not create and shall not be construed to create a joint venture, partnership or agency relationship between you and the Site or SNT Media."]
        },{
          subHeader: 'Limitation of Liability and Disclaimer of Warranties are Material Terms of these Terms',
          info: ["You agree that the provisions of these Terms that limit liability and disclaim warranties are essential terms of these Terms of Service."]
        },{
          subHeader: 'Entire Agreement',
          info: ["These Terms constitute the entire agreement between you and the Site and supersede all prior or contemporaneous understandings regarding such subject matter. No amendment to or modification of these Terms will be binding unless made in writing and signed by SNT Media. No failure to exercise, and no delay in exercising, on the part of either party, any right or any power hereunder shall operate as a waiver thereof, nor shall any single or partial exercise of any right or power hereunder preclude further exercise of any other right hereunder. In the event of a conflict between these Terms and any applicable purchase or other terms, these Terms shall govern."]
        },{
          subHeader: 'Contact Us',
          info: ["To contact us, please use the following:"]
        },{
          info: ["<b>Email</b><a href='mailto:support@sntmedia.com' target='_blank' class='text-master'> support@sntmedia.com</a>"]
        },{
          info: ["SNT Media<br>110 Main St, Suite 1000<br>Wichita, KS 67202"]
        },{
          info: ["Effective Date: November 02, 2016"]
        }
      ]
    }
  }
  @HostListener('window:scroll',['$event']) onScroll(e){
    var scrollWidget=e.target.body.getElementsByClassName('condition-page-container2b')[0];
    var header = e.target.body.getElementsByClassName('header')[0];
    var fixedHeader = e.target.body.getElementsByClassName('fixedHeader')[0] != null ? e.target.body.getElementsByClassName('fixedHeader')[0].offsetHeight : 0;
    let widgetTop = 0;
    widgetTop = header != null ? widgetTop + header.offsetHeight : widgetTop;
    widgetTop = widgetTop - fixedHeader;
    var scrollTop = e.srcElement.body.scrollTop;
    let scrollUp = scrollTop - this.scrollTopPrev>0?true:false;
    this.scrollTopPrev=scrollTop;
    if(scrollWidget){
      if(window.scrollY>widgetTop){
        if(scrollUp) {
          var topstyle = window.scrollY - widgetTop + 'px';
          this._render.setElementStyle(scrollWidget, 'top', topstyle);
        }else{
          var headerTop=e.target.body.getElementsByClassName('header-top')[0];
          var partnerheadTop=document.getElementById('partner_header')?document.getElementById('partner_header').offsetHeight:0;
          var topstyle = headerTop.offsetHeight? window.scrollY - widgetTop + headerTop.offsetHeight + partnerheadTop + 35 + 'px' :window.scrollY - widgetTop + partnerheadTop + 'px';
          this._render.setElementStyle(scrollWidget, 'top', topstyle);
        }


      }else{
        this._render.setElementStyle(scrollWidget, 'top', '0px');

      }
    }

  }
}
