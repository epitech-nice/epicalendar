# Git Branch Standards Guide - EPICALENDAR

## Table of Contents
1. [Introduction](#introduction)
2. [Branch naming conventions](#branch-naming-conventions)
3. [Branch usage rules](#branch-usage-rules)
4. [Pull request process](#pull-request-process)



## Introduction

This document defines the standards to follow when creating, using, and merging branches in our project.  
Good branch conventions improve collaboration, prevent conflicts, and ensure a clean Git history.



## Branch naming conventions

- **Language**: English only
- **Format**: kebab-case
- **Meaning**: The name must clearly describe the feature, fix, or task, but **not be a full sentence**.


### Examples

✅ `user-auth`  
✅ `socket-support`  
❌ `featureForUserAuthentication` (not kebab-case)  
❌ `fix the issue with login` (full sentence)



## Branch usage rules

- **No commits on `main`**  
  All changes must go through a dedicated branch and be merged via a pull request.

- **Feature branches only**  
  Each branch must represent a **specific feature, fix, or task**.

- **Merging**  
  Before merging a branch ensure **GitHub Actions** pass (if enabled).



## Pull request process

When opening a pull request (PR), follow these rules:

1. **Title**  
   Must follow the format:  
```sh
MERGE: "<branch-to-merge>" into "<target-branch>"
```

Example:  
`MERGE: "user-auth" into "main"`

2. **Description**  
  Provide either:
- The **list of commits** from the branch, OR
- A **detailed summary** of the changes introduced.

3. **Metadata**
- Add the **correct labels**
- Specify the **milestone** impacted
- Link the PR to the relevant **GitHub Project** with every field filled in
- Move the project card to status **"Merged branches"**
- If related **issues** exist, link them

4. **Assignees & Reviews**
- Assign yourself to the PR
- The PR must receive at least **one peer review** before merging

5. **After merging**
- The branch must be **deleted**
- The merge commit must use the **same title and description** as the PR



## Summary

- Branch names = **English + kebab-case + clear purpose**
- **No direct commits to main**
- PRs = **strict format (title, description, metadata, review required)**
- **Delete branches after merging**
- Ensure **tests/CI/scripts** pass before merging  

