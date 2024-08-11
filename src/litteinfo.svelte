<script lang="ts">
	export let color: 'primary' | 'primary-container' | 'outline' | 'background' = 'primary';
</script>

<div class="litteinfo m3-font-label-medium {color}">
	<slot />
</div>

<style>
	.litteinfo {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0.25rem 0.5rem;
		border-radius: 1rem;
	}

	.primary {
		background-color: rgb(var(--m3-scheme-primary));
		color: rgb(var(--m3-scheme-on-primary));
	}

	.primary-container {
		background-color: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
	}

	.outline {
		background-color: transparent;
		color: rgb(var(--m3-scheme-on-background));
		border: 1px solid rgb(var(--m3-scheme-outline));
	}

    .background {
        background-color: rgb(var(--m3-scheme-background));
        color: rgb(var(--m3-scheme-on-background));
    }
</style>
