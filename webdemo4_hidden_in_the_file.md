# Hidden in the File (Part 4 of 4: Forensics / Steganography)

**Category:** Forensics
**Difficulty:** Beginner (High School)
**Tool:** Browser, StegOnline (georgeom.net/StegOnline), a QR scanner

## Description

The unlisted staff archive page (Part 3) has a photo on it. It looks completely ordinary, which is exactly the point: the flag is hidden in the image's pixels themselves, not in any text you can read.

This is real steganography. The picture's color values have been altered by the smallest amount possible, one bit per color channel per pixel, in a way that's invisible to the eye but recoverable if you look at the right "layer" of the image.

## Steps (for the walkthrough)

1. Download the photo from the staff archive page (`hidden-qr.png`).
2. Open [StegOnline](https://georgeom.net/StegOnline/) and upload the image.
3. Use the LSB extraction feature to pull out the least-significant bit plane (bit 0) of the color channels. A black-and-white pattern appears where the photo used to look plain.
4. That pattern is a QR code. Save or screenshot it, then scan it with any QR reader (a phone camera, or an online QR decoder).
5. The QR code decodes straight to the flag.

## Hint

"Least significant bit" steganography hides one extra bit of data in each color value; changing that one bit shifts a pixel's brightness by at most 1 out of 255, far too small to notice normally. Any color channel you extract will show the same hidden pattern, since it was hidden identically in all three.

## Flag format

`CZCTF{...}`

## Notes

This is the only step in the whole chain that produces the actual flag. As requested, no page in this demo checks the flag for you; submit it in CTFd.
