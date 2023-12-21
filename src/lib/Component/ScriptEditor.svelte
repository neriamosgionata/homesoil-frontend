<script lang="ts">

    let isEditing = false;
    let script = "";

    const createNewScheduledScript = () => {

    }


</script>

<!-- Script editor component -->

<div class="script-editor">
    <div class="script-editor__header">
        <div class="script-editor__header__title">
            <span class="script-editor__header__title__text">Script Editor</span>
        </div>
        <div class="script-editor__header__buttons">
            <button class="script-editor__header__buttons__button" on:click={() => createNewScheduledScript()}>Save</button>
        </div>
    </div>
    <div class="script-editor__body">
        <div class="script-editor__body__editor">
            <div class="script-editor__body__editor__header">
                <span class="script-editor__body__editor__header__text">Script</span>
            </div>
            <div class="script-editor__body__editor__body">
                <textarea class="script-editor__body__editor__body__textarea" id="script-editor__body__editor__body__textarea"></textarea>
            </div>
        </div>
        <div class="script-editor__body__output">
            <div class="script-editor__body__output__header">
                <span class="script-editor__body__output__header__text">Output</span>
            </div>
            <div class="script-editor__body__output__body">
                <div class="script-editor__body__output__body__text" id="script-editor__body__output__body__text"></div>
            </div>
        </div>
    </div>
</div>