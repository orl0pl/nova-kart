<script lang="ts">
	export let show: boolean = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal-backdrop {show ? 'show' : 'hide'}"></div>
<div class="modal {show ? 'show' : 'hide'}" role="dialog">
	<slot />
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.65);
		z-index: 10;
	}
	.modal {
		background-color: rgb(var(--m3-scheme-surface));
		padding: 2rem;
		border-radius: 1.5rem;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 11;
		height: fit-content;
	}

	.modal.hide {
		display: hidden;
		visibility: hidden;
		overflow: hidden;
		animation: hideModal 0.3s forwards;
	}

	@keyframes hideModal {
		0% {
			scale: 1;
			display: block;
		}
		100% {
			transform: translate(0%, 0%);
			scale: 0;
			top: -50%;
			left: 100%;
			display: none;
		}
	}

	.modal-backdrop.hide {
		animation: hideBackdrop 0.3s forwards;
	}

	@keyframes hideBackdrop {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			visibility: hidden;
		}
	}
</style>
