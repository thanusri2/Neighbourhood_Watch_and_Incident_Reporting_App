# Problem Statement

 1. Title
	Neighborhood Watch & Incident Reporting System

 2. Domain
	Community Security and Incident Management

 3. Who is the user?

Resident:
	*Register and log in to the system.
	*Report security-related incidents.
	*Upload photos as evidence.
	*Track the status of reported incidents.
	*Receive notifications about updates.

Security Guard:
	* View assigned incidents.
	* Investigate reported issues.
	* Update the incident status.
	* Add investigation remarks.

Community Admin:
 	*Manage residents and security guards.
 	*Assign incidents to security guards.
 	*Monitor all reported incidents.
 	*Generate reports and view analytics.

 4. What problem are we solving?
	Many residential communities still rely on phone calls, WhatsApp groups, or manual registers to report security incidents. These methods often lead to delayed responses, missing records, and poor communication between residents and security staff. Residents cannot easily track the progress of their complaints, and administrators struggle to manage incidents efficiently. This project provides a secure and centralized platform where incidents can be reported, assigned, tracked, and resolved in an organized manner.
	
 5. Proposed Solution (What the application will do)
	The application allows residents to report incidents such as theft, suspicious activities, parking violations, broken CCTV cameras, water leakage, and other community-related issues. Residents can upload supporting images and monitor the progress of their reports. Security guards can investigate assigned incidents and update their status, while community administrators manage users, assign incidents, monitor activities, and generate reports. The system also provides secure authentication, role-based access control, notifications, and activity logging.

6. Core Entities / Database Tables 
* Users
* Residents
* Security Guards
* Incidents
* Incident Categories
* Incident Assignments
* Evidence
* Notifications
* Activity Logs

7. User Roles & Permissions (Minimum 2 distinct roles)

Resident:
	* Register and log in
	* Report incidents
	* Upload evidence
	* View personal incident history
	* Receive notifications
	* Update profile

Security Guard:
	* Log in
	* View assigned incidents
	* Update incident status
	* Add investigation remarks
	* Mark incidents as resolved

Community Admin:
	* Manage residents and security guards
	* Assign incidents
	* View all reported incidents
	* Generate reports and analytics
	* Monitor overall system activities

 8. Success Criteria
	* Residents should be able to register and submit an incident report within two minutes.
	* Security guards should be able to update incident status quickly.
	* Community administrators should be able to assign and monitor incidents efficiently.
	* Only authorized users should be able to access system features based on their roles.
	* All incident records should be stored securely and remain available for future reference.

 9. Out of Scope
    The following features are not included in this project:
	* Integration with real police or government systems
	* Emergency calling services
	* Live CCTV video streaming
	* GPS-based real-time tracking
	* Payment gateway integration
	* Biometric authentication
	* Native Android or iOS mobile application

 10. Chosen Track
    Python (Django)