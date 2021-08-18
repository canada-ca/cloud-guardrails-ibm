## 09 - Network Security Services

### Establish external and internal network perimeters and monitor network traffic

This is handled by Security Foundations Blueprints 


GUARDRAIL Policies:
 - Confirm policy for network boundary protection.
 - Confirm policy for limiting number of public IPs.
 - Confirm policy for limiting to authorized source IP addresses (e.g. GC IP addresses).

To enforce these policies, all compute services must be connected to an appropriate Firewall appliance that's configured to meet the guardrail policies.

GUARDRAIL Steps:
1) Run the script to audit the environment.  Script will query against all compute services and determine if they are connected to a firewall or Load Balancer.
2) If the server is private-only, then it's exempt from firewalls.
3) If the server has public-facing connectivity then a firewall will be required to restrict egress, IPs, and associated ports.
4) Report will contain which compute services have and which have-not attached firewalls.

Use this report to validate and list all unattached servers that require endpoint protection.
