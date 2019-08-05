const Noise = function(width, height) {
	class Noise {
		constructor(width, height) {
			if (isNaN(width) || isNaN(height)) {
				console.error("Width and Height must both be numbers.");
				return undefined;
			}

			this.bytes = (function() {
				let bytes = [];

				for (let i = 0; i < 512; i += 1) {
					let b = (((Math.random() * 100) * ((Math.random() >= .7) ? 3 : 1)).toFixed(0) >> ((Math.random() >= .7) ? 2 : 0));

					if (b > 255) b = 255;

					bytes.push(b);
				}

				return bytes;
			})();
			this.width = width;
			this.height = height;
		}

		getNoise(scale, isFixed = false) {
			if (isNaN(scale)) {
				console.error("Scale must be a number.");
				return undefined;
			}

			let values = [];

			for (let i = 0; i < this.width; i += 1) {
				for (let j = 0; j < this.height; j += 1) {
					let g = (this.generate(i * scale, j * scale) * 128 + 128);
					values[i, j] = (isFixed) ? parseInt(g.toFixed(0)) : g;
				}
			}

			return values;
		}

		generate(x, y) {
			function gradient(hash, x, y) {
				let h = hash & 7;
				let u = (h < 4) ? x : y;
				let v = (h < 4) ? y : x;

				return (((h & 1) != 0) ? -u : u) + (parseFloat(((h & 2) != 0) ? -2.0 : 2.0) * v);
			}

			const F2 = parseFloat(.5 * (Math.sqrt(3) - 1));
			const G2 = parseFloat((3 - Math.sqrt(3)) / 6);

			let n0, n1, n2;

			let s = (x + y) * F2;
			let xs = x + s;
			let ys = y + s;
			let i = Math.floor(xs);
			let j = Math.floor(ys);

			let t = (i + j) * G2;
			let X0 = i - t;
			let Y0 = j - t;
			let x0 = x - X0;
			let y0 = y - Y0;

			let i1 = (x0 > y0) ? 1 : 0;
			let j1 = (x0 > y0) ? 0 : 1;

			let x1 = x0 - i1 + G2;
			let y1 = y0 - j1 + G2;
			let x2 = x0 - parseFloat(1) + parseFloat(2) * G2;
			let y2 = y0 - parseFloat(1) + parseFloat(2) * G2;

			let ii = i % 256;
			let jj = j % 256;

			let t0 = parseFloat(.5) - x0 * x0 - y0 * y0;

			if (t0 < parseFloat(0))
				n0 = parseFloat(0);
			else
			{
				t0 *= t0;
				n0 = t0 * t0 * gradient(this.bytes[ii + [jj]], x0, y0);
			}

			let t1 = parseFloat(.5) - x1 * x1 - y1 * y1;

			if (t1 < parseFloat(0))
				n1 = parseFloat(0);
			else
			{
				t1 *= t1;
				n1 = t1 * t1 * gradient(this.bytes[ii + i1 + this.bytes[jj + j1]], x1, y1);
			}

			let t2 = parseFloat(.5) - x2 * x2 - y2 * y2;

			if (t2 < parseFloat(0))
				n2 = parseFloat(0);
			else
			{
				t2 *= t2;
				n2 = t2 * t2 * gradient(this.bytes[ii + 1 + this.bytes[jj + 1]], x2, y2);
			}

			return parseFloat(40) * (n0 + n1 + n2);
		}
	}

	return new Noise(width, height);
};
