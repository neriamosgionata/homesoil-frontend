<script lang="ts">
    import {sensors} from "$lib/stores/store";
</script>

<div>
    <h1>Sensors</h1>
    <ul>
        {#each Object.values($sensors) as sensor}
            <li>
                <a href="/sensors/{sensor.id}">{sensor.name} ({sensor.ip_address})</a>
            </li>
        {/each}
    </ul>
</div>