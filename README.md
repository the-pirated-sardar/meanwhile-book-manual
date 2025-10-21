## Intro

I was given a book with 3,856 possible story paths. My programmer brain took over and now the fun is to solve the whole book.

## Project Info

All story blobs are stored as images.

All images are labelled and exist within the repo, however the connections are still being mapped out manually.

Once that is done, a DFS/BFS/A* algorithm will map out all possible story outcomes and the project will be updated with the paths found. 

## About The Book

This project is based on the book Meanwhile by Jason Shiga, a cartoonist and math graduate. The book was put together using algorithms, so it's only fair that it be decoded using those as well. 

## Manually Adding Storylines

Currently, 5 storylines exist on the website. They were manually added as the node graph is still being constructed. This was done using the following terminal commands:

### Adding a Storyline:

```
npm run path:add -- --path "I-1->I-2->I-3->I-5->I-51->I-50->I-47->FI-1->H-3->H-2->H-1->E-1" --title "Vanilla Timeline"
```
This example command was used to create Story 1. Any addition will go at the end of the list and be named S-XYZ, where XYZ would be 001 for story 1. 

### Deleting a Storyline:

```
npm run story:rm -- --id S-001
```
This example can be used to purge Story 1, if it exists.
