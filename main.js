let op = 0 // This variable tracks how many pixels have been modified to blue in rgbdiff()

const rgbdiff = ((c, arr) => {
    let mindiff = Infinity
    let min = [0, 0, 0]


    let g = [193, 77, 112]
    // Calculate the color difference between the input color "c" and the color "g", then round it to the nearest integer
    let diff2 = Math.round(c.reduce((a, b, i) => a + Math.abs(b - g[i])) / 3)
    // If the difference is less than an input value, return a blue color
    if (diff2 < parseInt(document.querySelector('input').value)) {
        op++
        return [50, 50, 255]
    }
    else return c

    // Iterate through the array of colors "arr" to find the color with the smallest difference from the input color "c", and return that color
    for (let c2 of arr) {
        let diff = c2.reduce((a, b, i) => a + Math.abs(b - c[i]))
        if (diff < mindiff) {
            mindiff = diff
            min = c2
        }
    }

    return min
});

globalThis.ColorThief = new ColorThief()
const img = new Image()

let banger = (async () => {
    document.querySelector('div').innerHTML = ''
    img.src = '/balling.jpg'

    // Wait until the image has loaded
    await new Promise((r) => img.onload = () => r())
    globalThis.palette = await ColorThief.getPalette(img, 3)

    const doit = ((palette, image) => {
        op = 0
        const canvas = document.createElement('canvas')
        const ctx = globalThis.ctx = canvas.getContext('2d', {
            willReadFrequently: true
        })

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(image, 0, 0)

        let data = ctx.createImageData(1, 1)
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                let [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data
                // Find the closest color in the palette to the current pixel's color
                let closest = rgbdiff([r, g, b], palette)

                let lightness = Math.floor((((255 - r) + (255 - g) + (255 - b)) / 3)) - 80

                let e = [...closest, a]

                if (/*lightness > 0*/false) {
                    while (lightness > 20) lightness = Math.floor(lightness / 1.5)

                    e[0] += lightness
                    e[1] += lightness
                    e[2] += lightness
                }

                for (let i in e) {
                    data.data[i] = e[i]
                }

                ctx.putImageData(data, x, y)
            }
        }

        let output = new Image()
        output.src = canvas.toDataURL()
        return output
    })

    document.body.querySelector('div').appendChild(doit(globalThis.palette, img))
    document.body.querySelector('button').innerHTML = `render (area: ${(op * 4) / 1000000}km2)`
})

banger()
