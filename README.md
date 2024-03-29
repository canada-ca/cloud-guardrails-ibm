# Government of Canada Cloud Guardrails Checks for IBM Cloud

This repository will provide the tools required to validate the minimum guardrails for the GC Cloud Operationalization Framework for IBM Cloud

## GC Guardrails

The following tables contains the list of [Cloud Guardrails](https://github.com/canada-ca/cloud-guardrails) 
You can also reach the IBM Cloud - [Government of Canada Guardrail Accelerator here: IBM Cloud Accelerator ](https://github.com/ibmcloud-tech-canada/ibmcloud-gc-guardrails-accelerator) 

| Guardrail | Description | Enforcement | Link |
|----|----|----| --- |
| 01 Protect Root / Global Admins Account | Protect root or master account used to establish the cloud service. | Doc | [link](./guardrails/01-mfa-validation/guardrail-1-mfa.md)  |
| 02 Management of Administrative Privileges | Establish access control policies and procedures for management of administrative privileges | Doc | [link](./guardrails/02-management-administration-privileges/management-administration-privileges.md)   |
| 03 Cloud Console Access | Limit access to GC managed devices and authorized users. | Doc | [link](./guardrails/03-cloud-console-access/cloud-console-access.md)  |
| 04 Enterprise Monitoring Accounts | Create role-based account to enable enterprise monitoring and visibility. | Rego | [link](guardrails/04-monitoring-account/04-monitoring-account.md) |
| 05 Data Location | Establish policies to restrict GC sensitive workloads to approved geographic locations. | Rego | [link](guardrails/05-data-location) |
| 06 Protection of Data-At-Rest | Protect data at rest by default (e.g. storage) for cloud-based workloads. | Doc | [link](./guardrails/06-data-at-rest/guardrail-6-at-rest.md) |
| 07 Protection of Data-In-Transit | Protect data transiting networks through the use of appropriate encryption and network safeguards. | Doc | [link](./guardrails/07-data-in-transit/guardrail-7-in-transit.md) |
| 08 Segment and Separate | Segment and separate information based on sensitivity of information. | Rego | [link](./guardrails/08-segment-separate/guardrail-8-segment-separate.md) |
| 09 Network Security Services | Establish external and internal network perimeters and monitor network traffic.| Rego | [Link](./guardrails/09_Limit_egress_traffic/guardrails-9-network-security-services.md) |
| 10 Cyber Defence Services | Establish MOU for defensive services and threat monitoring protection services. | MOU |
| 11 Logging and Monitoring | Enable logging for the cloud environment and for cloud-based workloads. | Rego | [Link](./guardrails/11-logging-and-monitoring/guardrail-11-logging-monitoring.md) |
| 12 Configuration of Cloud Marketplaces | Configuration of Cloud Market Places | Rego | [Link](./guardrails/12-market-place/guardrail-12-marketplace.md) |

