<script lang="ts">
    import {socket_token} from "$lib/stores/store";
    import {goto} from "$app/navigation";

    let token = "";

    const login = () => {
        if (!token) {
            return;
        }

        socket_token.set({token});
        setTimeout(() => goto("/dashboard"), 100);
    };
</script>

<div class="container">
    <form class="bg-blue text-center w-1/3 px-3 py-4 text-white mx-auto rounded">
        <input
                type="password"
                placeholder="Token"
                class="block w-full mx-auto text-sm py-2 px-3 rounded my-3 text-gray-700"
                bind:value={token}
        />
        <button
                class="text-white font-bold py-2 px-4 rounded border block mx-auto w-full bg-blue-500 hover:bg-blue-700"
                on:click={() => login()}
        >
            Login
        </button>
    </form>
</div>