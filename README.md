# Image Upload

This Cloudflare worker is used to handle image uploads for [spaced](https://github.com/zsh-eng/spaced).

It is authenticated using a bearer token.

When users upload images to spaced, the image is sent to the spaced backend,
which will forward the request to this worker.

The worker returns the URL of the uploaded image.

## Format

Images should be uploaded to the `/upload` endpoint using a `PUT` request.
The request should be a Multipart form with the image file as the `file` field.