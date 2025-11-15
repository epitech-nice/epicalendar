# Git Commit Standards Guide - AREA

## Table of Contents
1. [Introduction](#introduction)
2. [Commit message format](#commit-message-format)
3. [Commit types](#commit-types)



## Introduction

This document defines the standards to follow for commit messages in our project. Good commit conventions improve history readability, facilitate automatic changelog generation, and help team collaboration, which is particularly important in complex projects.



## Commit message format

We use the **Conventional Commits** convention with the following structure:
```
<type>: <description>
```


### Basic rules

- **Language**: English
- **Case**: Uppercase for type and Lowercase for description



## Commit types


### Main types (Conventional Commits)

| Type       | Description                                | Example                                                   |
|------------|--------------------------------------------|-----------------------------------------------------------|
| `FEAT`     | New feature                                | `FEAT: add thread pool implementation`                    |
| `FIX`      | Bug fix                                    | `FIX: resolve memory leak in vector destructor`           |
| `DOCS`     | Documentation                              | `DOCS: update documentation for Logger class`             |
| `STYLE`    | Formatting, code style                     | `STYLE: apply clang-format to all source files`           |
| `REFACTOR` | Code refactoring                           | `REFACTOR: extract common functionality to base class`    |
| `TEST`     | Adding or modifying tests                  | `TEST: add unit tests for Matrix multiplication`          |
| `BUILD`    | Maintenance, build tasks                   | `BUILD: update CMakeLists.txt for C++20 support`          |
| `PERF`     | Performance improvements                   | `PERF: optimize sorting algorithm with SIMD instructions` |
| `CI`       | Continuous integration                     | `CI: add GitHub Actions for cross-platform builds`        |
| `REVERT`   | Reverting a previous commit                | `REVERT: revert "feat: add experimental allocator"`       |
| `ADD`      | Adding new files                           | `ADD: add new header file for string utilities`           |
| `REMOVE`   | Removing files or obsolete code            | `REMOVE: remove deprecated C++11 compatibility layer`     |
| `RENAME`   | Renaming files/classes                     | `RENAME: rename FileHandler to FileManager`               |
| `MOVE`     | Moving files                               | `MOVE: relocate headers to include/ directory`            |
| `MERGE`    | Merging branches                           | `MERGE: merge feature/async-processing branch`            |
| `INIT`     | Component initialization                   | `INIT: initialize project structure with CMake`           |
| `DETAILS`  | Use to make detailed commits in multi-line | `DETAILS:\nFIX: fix bug in the library`                   |