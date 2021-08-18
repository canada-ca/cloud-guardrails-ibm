The tentants have full access and can provision resources from anywhere. Guardrail needs a script to capture & audit all the resources and isolate where they're provisioned from.


Output the 3-column flat-file list of resources with test results (MON01 & TOR01/02/03 pass, all others fail):

Resource ID | Location | Pass/fail
------------|----------|----------
...|...|...
...|...|...
...|...|...


Can use:
 - CLI batch script
 - IBM Cloud Shell batch script
 - Ansible / Terraform
 
 
 CCCS or SSC can run this monthly or as they see fit via their monitoring account.
 
UPDATE:
I was not aware that we can restrict regions for provisioning.  If that's the case, please provide the instructions on how to limit GEOs.

 - Also #1, is this done via master-account or will each tenant create their own resstrition?
 - Also #2, if restricted by tenant, do we need to validate to CCCS/SSC that this rule is in place?
 
