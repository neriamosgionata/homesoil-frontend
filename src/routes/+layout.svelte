<script lang="ts">
    import "../app.css";

    export const ssr = false;
</script>

<div class="w-full h-full flex flex-col bg-[#003f5c]">
    <div class="p-8 h-100 w-100">
        <slot/>
    </div>
</div>