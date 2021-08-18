##  Configuration of Cloud Marketplaces

### Restrict Third-Party CSP Marketplace software to GC-approved products

### Private Catalog
To restrict the available solutions to only GC-approved solutions you need to create a private catalog and add solutions to the private catalog. Private Catalogs are where administrators have control over what solutions are available i.e whitelist.

### Public Marketplace

IBM Cloud also provides Public Marketplace which requires permissions to deploy solutions. Departments do not control what is available in the public marketplace. But by default without the right permissions users cannot deploy solutions from the public marketplace. We suggest that you assign the Billing Administrator (roles/billing.admin) IAM role if you want users to purchase services from Public Cloud Marketplace. 

### Validation
The validation Guardrail will identify users who should not have the permissions required.
