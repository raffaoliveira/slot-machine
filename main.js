function slotMachine() {
	const items = [
		"🐮",
		"🐄",
		"🥛",
		"🧀",
		"🚜",
		"🌞",
		"🐮",
		"🐄",
		"🥛",
		"🧀",
		"🚜",
		"🌞",
		"🐮",
		"🐄",
		"🥛",
		"🧀",
		"🚜",
		"🌞",
		"🐮",
		"🐄",
		"🥛",
		"🧀",
		"🚜",
		"🌞",
		"🐮",
		"🐄",
		"🥛",
		"🧀",
		"🚜",
		"🌞",
		"🐮",
		"🐄",
		"🥛",
		"🧀",
		"🚜",
		"🌞",
	];

	const doors = document.querySelectorAll(".door");
	let resultTemp = [];

	const gameState = {
		isSpinning: false,
	};

	document.querySelector("#spinner")?.addEventListener("click", spin);
	document.addEventListener("keydown", (event) => {
		if (event.key === "Enter") spin();
	});

	function init(firstInit = true, groups = 1) {
		document.addEventListener("DOMContentLoaded", showResults);
		for (const door of doors) {
			if (firstInit) {
				door.dataset.spinned = "0";
			} else if (door.dataset.spinned === "1") {
				return;
			}

			const boxes = door.querySelector(".boxes");
			if (!boxes) continue;

			const boxesClone = boxes.cloneNode(false);
			const pool = ["❓"];

			if (!firstInit) {
				const arr = [];
				for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
					arr.push(...items);
				}
				pool.push(...shuffle(arr));
				boxesClone.addEventListener(
					"transitionstart",
					function () {
						door.dataset.spinned = "1";
						for (const box of this.querySelectorAll(".box")) {
							box.style.filter = "blur(1px)";
						}
					},
					{ once: true },
				);

				boxesClone.addEventListener(
					"transitionend",
					function () {
						let index = 0;
						const itemsDisplayed = [];
						for (const box of this.querySelectorAll(".box")) {
							box.style.filter = "blur(0)";
							if (index > 0) this.removeChild(box);
							index++;
							itemsDisplayed.push(box.textContent);
						}
						const itemScore = itemsDisplayed[0];
						resultTemp.push(itemScore);
						if (resultTemp.length === doors.length) {
							saveResult();
						}
					},
					{ once: true },
				);
			}

			for (let i = pool.length - 1; i >= 0; i--) {
				const box = document.createElement("div");
				box.classList.add("box");
				box.style.width = `${door.clientWidth}px`;
				box.style.height = `${door.clientHeight}px`;
				box.textContent = pool[i];
				boxesClone.appendChild(box);
			}

			boxesClone.style.transitionDuration = "6s";
			boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
			door.replaceChild(boxesClone, boxes);
		}
	}

	async function saveResult() {
		const name = document.querySelector("#name");
		const data = JSON.parse(localStorage.getItem("slotMachine")) || [];
		const result = resultTemp.join(" ");
		data.push({ name: name.value, result });
		localStorage.setItem("slotMachine", JSON.stringify(data));
		resultTemp = [];
		addResultOnList(name.value, result);
		setTimeout(() => {
			init();
			name.value = "";
		}, 1200);
	}

	function createListItem(name, result) {
		const li = document.createElement("li");
		const nameSpan = document.createElement("span");
		nameSpan.classList.add("spanName");
		nameSpan.textContent = name;

		const resultSpan = document.createElement("span");
		resultSpan.classList.add("spanScore");
		resultSpan.textContent = result;

		li.appendChild(nameSpan);
		li.appendChild(resultSpan);

		return li;
	}

	function addResultOnList(name, result) {
		const ul = document.querySelector("#result");
		const li = createListItem(name, result);
		ul.prepend(li);
	}

	async function showResults() {
		const data = JSON.parse(localStorage.getItem("slotMachine")) || [];
		const reversedData = data.reverse();
		const results = document.querySelector("#result");
		results.textContent = "";

		for (const { name, result } of reversedData) {
			const li = createListItem(name, result);
			results.appendChild(li);
		}
	}

	async function spin() {
		if (gameState.isSpinning) return;
		const name = document.querySelector("#name").value;
		if (!name) {
			const inputName = document.querySelector("#name");
			inputName.placeholder = "Digite seu nome";
			inputName.focus();
			return;
		}
		gameState.isSpinning = true;
		resultTemp = [];
		init(false, 1);
		try {
			for (const door of doors) {
				const boxes = door.querySelector(".boxes");
				if (!boxes) continue;

				const duration = Number.parseInt(boxes.style.transitionDuration);
				boxes.style.transform = "translateY(0)";
				await new Promise((resolve) => setTimeout(resolve, duration * 200));
			}
			gameState.isSpinning = false;
		} catch (error) {
			console.error("Erro durante o spin:", error);
			gameState.isSpinning = false;
		}
	}

	function shuffle([...arr]) {
		let m = arr.length;
		while (m) {
			const i = Math.floor(Math.random() * m--);
			[arr[m], arr[i]] = [arr[i], arr[m]];
		}
		return arr;
	}

	try {
		showResults();
		init();
	} catch (error) {
		console.error("Erro na inicialização:", error);
	}
}

slotMachine();
