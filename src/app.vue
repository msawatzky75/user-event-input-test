<template>
	<div>
		test

		<button data-testid="button" @click="getData">button</button>
		<label for="checkbox">
			<input v-model="checkbox" data-testid="checkbox" id="checkbox" type="checkbox" />
			checkbox
		</label>

		<input type="text" data-testid="text-input" @input="getData" />

		<div data-testid="div-button" @click="getData">button but its fake</div>

		<div>{{ message }}</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "base-app",
	data() {
		return {
			message: "Hello World",
			checkbox: false,
		};
	},
	watch: {
		checkbox(val) {
			console.log(val);
			this.getData();
		},
	},
	methods: {
		async getData() {
			this.message = await fetch("http://localhost/test").then((res) => res.text());
		},
	},
});
</script>
