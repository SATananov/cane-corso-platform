# Step 123 — ML-safe Photo Assistant Prototype

Status: PASS-ready foundation.

## Purpose

Step 123 adds a deterministic, ML-safe prototype for photo review suggestions. It behaves like a future assistant contract without performing real machine learning.

## What it can suggest

- expected view: side, front, head, unknown
- assistant quality: good, usable, needs better photo, missing
- assistant confidence: low, medium, high
- dataset use: training candidate after admin confirmation, review only, or needs admin label

## What it never does

- It never proves breed.
- It never approves Registry publication.
- It never issues or approves a USG Certificate.
- It never replaces human USG Review.

## Future ML path

A future model may help with blur, lighting, dog visibility, full-body framing, side/front/head view detection, and wrong-angle detection. The admin final label remains the learning target.
