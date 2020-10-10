# Contributing to Async Airtable

💖 **Hi!** Thanks so much for thinking about contributing. We're so glad you're here! 💖

**Ok... Let's get down to business!**

## A Word About Git Flow

We have recently transitioned to using Git Flow for managing features, hotfixes, and releases. If you're not familiar with Git Flow, we suggest you head over to [this page](https://datasift.github.io/gitflow/TheHubFlowTools.html) and give it a quick read.

## Setting Up Your Environment

1. Add the [testing base](https://airtable.com/addBaseFromShare/shrU70u93JxzNqBhe?utm_source=airtable_shared_application) to a new or existing base on your Airtable account.
2. Get the base ID of the newly create base. You can do this by heading over to [Airtable's API page](https://airtable.com/api) and selecting that base from the list, you should see:
   > _The ID of this base is BASE_ID_
3. Create an .env file in the repository root, using the supplied [.sample.env](.sample.env) file as a template.
4. Make sure to copy the **base ID** and your **[API key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-)** into the newly create .env file.
5. Install all dependancies:
   `npm install`
6. Verify everything is working with a quick run of the tests.
   `npm test`
7. You should be good to get to work!👍

## The Developer's Code

### Code of Conduct

In addition to the guidelines below, check out our [Code of Conduct](CODE_OF_CONDUCT.md).

### General Guidelines

- Keep your Pull Requests Short (when possible)
- Document your code, please. We know it was hard to code... but it doesn't have to be hard to read.
- Test your code! Write some tests, please. They don't need to be fancy, we just want to know it works.
- All commits need to be verified with a GPG signature.
- We run ESLint & Prettier during every commit... so be mindful that our coding style guide may irritate you if you like 4 space tabs, and hate semicolons.

### New Features

Members of the community, please feel welcome to fork a copy of the code and tackle any outstanding issues. We will make sure to tag some 'Good first issues' for anyone looking to get some practical coding experience (and we'll vouch for you if you throw us on your CV). That in mind, please follow the guidelines below for new feature submission.

- All new features should be branched off the latest `develop` branch commit.
- Feature branches should be prefixed with `feature/` and contain a brief description of the feature in the branch name
  - _Example: `feature/add-response-routes`_
- Once finished with a feature, create a PR on the develop branch.
- Once the PR is submitted, we will take care of reviewing and merging to the appropriate branch(es).
- If not already there... we will add you the list of contributors to the project.

### New Releases

Only members of the core team will usually be creating release branches, but the following guidelines should help if the need arises for community assistance.

- All new release should be branched off the latest `develop` branch commit.
- Release branches should be prefixed with `release/` and contain the upcoming version number.
  - _Example: `release/1.5`_
  - _Please don't use patch level version numbers, as those will be create from the respective hotfix branch._
- Any outstanding feature branches that will be included should be merged in to develop prior to creating the release branch.
- As additional features and bugfixes are merged in to their respective branchs, make sure they find their way to the upcoming release branch as well.
- When the time is ready. The release branch will be merged in to master with the appropriate release & tag.

### New Hotfixes (Bugfixes)

There may be some issues tagged that are mission critical hotfixes. We will most likely tackle them rather quickly, but if you see one that you'd like to fix... go for it. Just follow these guidelines.

- All new hotfixes should be branched off the latest `master` release/tag. **NOT the develop branch!**
- Hotfix/Bugfix branches should be prefixed with `hotfix/` and contain a brief summary of the fix.
  - _Example: `hotfix/fix-create-survey-status-code`_
- These PRs should be kept small, ideally touching only a few lines of code.
- We will take care of the rest from there! 😄

<p style="text-align:center;"><strong>Thanks so much!</strong</p>
