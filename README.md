# Numeric Sequence Calculator
---

> The design goal behind this application is to make it usable without significant UI lags for larger input values when performance comes into picture.
> This application is designed to be responsive, and makes use of modern web features like HTML5 (Mustache templates), CSS3 (bootstrap, and SCSS), and JavaScript (jQuery, RequireJS)
> For developers there is an associated set of unit and integration test cases written in Jasmine and Casper respectively

---
### Description

This is a web based app that lets you create following types of sequences from a given positive number:

1. All numbers up to and including the number entered
2. All odd numbers up to and including the number entered
3. All even numbers up to and including the number entered
4. All numbers up to and including the number entered, except when
    - A number is a multiple of 3 output C, and when,
    - A number is a multiple of 5 output E, and when,
    - A number is a multiple of both 3 and 5 output Z
5. All fibonacci numbers up to and including the number entered

---
### Instructions

This is a HTML5 application, and you could run it by cloning the project files to your local disk and running the index.html file using a web browser like Chrome, Firefox etc.

---
### TODO

 - Evaluate document fragments, web workers etc. to improve page performance and page size
 - Option to navigate to a page, and selecting specific sequences to see