<script lang="ts">
    import {sensor_reads, sensors} from "$lib/stores/store";
    import {page} from '$app/stores';

    let id = $page.params.id;
</script>

<div>
    <h1>Detail</h1>

    <p>id: {id}</p>

    {#if !$sensors[id]}
        <p>sensor not found</p>
    {:else}
        <p>name: {$sensors[id].name}</p>
        <p>ip address: {$sensors[id].ip_address}</p>
        <p>created at: {$sensors[id].created_at}</p>

        <hr class="my-4">

        <h2>Reads</h2>

        <table>
            <thead>
            <tr>
                <th>id</th>
                <th>sensor_id</th>
                <th>value</th>
                <th>created_at</th>
            </tr>
            </thead>
            <tbody>
            {#each $sensor_reads[id] as read}
                <tr>
                    <td>{read.id}</td>
                    <td>{read.sensor_id}</td>
                    <td>{read.sensor_value}</td>
                    <td>{read.created_at}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}

    <p>
        <a href="/sensors">back</a>
    </p>

</div>