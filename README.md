![N8N + Azure devops](https://i.postimg.cc/NFPVM7BM/n8n-azdo.png)

# n8n-nodes-azure-devops

This is an n8n community node. It lets you use Azure DevOps in your n8n workflows.

Azure DevOps is a suite of services from Microsoft that provides development and collaboration tools, including Azure Repos, Azure Pipelines, Azure Boards, Azure Test Plans, and Azure Artifacts. This node allows you to automate operations within Azure DevOps.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node provides a comprehensive set of operations to interact with various Azure DevOps resources. Below is a list of the available resources and their supported actions:

*   **Build**:
    *   **Create**: Queues a new build.
    *   **Get**: Retrieves a specific build.
    *   **List**: Lists all builds.
    *   **Execute**: Executes a specific action on a build.
*   **Pipeline**:
    *   **Run**: Runs a pipeline.
    *   **List**: Lists all pipelines.
    *   **Execute**: Executes a specific action on a pipeline.
*   **Project**:
    *   **Create**: Creates a new project.
    *   **Update**: Updates an existing project.
    *   **Delete**: Deletes a specific project.
    *   **Get**: Retrieves a single project by its ID.
    *   **List**: Lists all projects.
    *   **Execute**: Executes a specific action on a project.
    *   **Options**: Retrieves the available options for a project.
*   **Query**:
    *   **Create**: Creates a new query.
    *   **Delete**: Deletes a specific query.
    *   **Execute**: Executes a work item query.
*   **Release**:
    *   **Create**: Creates a new release.
    *   **List**: Lists all releases.
    *   **Execute**: Executes a specific action on a release.
*   **Repository**:
    *   **Create**: Creates a new repository.
    *   **Delete**: Deletes a specific repository.
    *   **Get**: Retrieves a single repository by its ID.
    *   **List**: Lists all repositories.
    *   **Execute**: Executes a specific action on a repository.repository.
*   **User**:
    *   **Create**: Adds a user to the organization.
    *   **Delete**: Deletes a user from the organization.
    *   **Get**: Retrieves a single user by their ID.
    *   **List**: Lists all users in the organization.
    *   **Execute**: Executes a specific action on a user.
*   **Work Item**:
    *   **Create**: Creates a new work item.
    *   **Update**: Updates an existing work item.
    *   **Delete**: Deletes a specific work item.
    *   **Get**: Retrieves a single work item by its ID.
    *   **List**: Lists work items based on specified criteria.
    *   **List Children**: Lists the child items of a specific work item.
    *   **Execute**: Executes a specific action on a work item.
   
## Credentials

To use this node, you need to authenticate with your Azure DevOps organization. You will need two pieces of information:

1.  **Organization URL**: The URL of your Azure DevOps organization (e.g., `https://dev.azure.com/your-organization`).
2.  **Personal Access Token (PAT)**: A token used to authenticate with the Azure DevOps API.

To create a Personal Access Token:

1.  Sign in to your Azure DevOps organization.
2.  Go to **User settings** > **Personal Access Tokens**.
3.  Click **+ New Token**.
4.  Give your token a name, select the desired scope of permissions (e.g., `Work Items - Read & write`), and set an expiration date.
5.  Click **Create**.
6.  **Important**: Copy the generated token immediately. You won't be able to see it again.

In n8n, create new credentials for Azure DevOps and enter your Organization URL and the Personal Access Token.

## Compatibility

This node has been validated and tested with n8n version `1.113.3` and later.

## Resources

*   [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
*   [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)
*   [Create a Personal Access Token (PAT)](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)
