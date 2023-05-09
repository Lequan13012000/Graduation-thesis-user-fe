<template>
    <div class="popup-question-container" id="InfoPupup">
        <div class="popup-question-bg"></div>
        <div class="m-popup-question info-popup-question">
            <div class="popup-question-content">
                <img src="../../../assets/icons/delete.svg" alt="">
                <div class="popup-question-text">{{ title }}</div>
            </div>
            <div class="popup-question-footer">
                <button class="button button-close" @click="$emit('close')">Hủy</button>
                <div class="list-button">
                    <button class="button bg-[#FC4B6C]" @click="$emit('yes')">Xóa</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.popup-question-container {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.2);
    justify-content: center;
    align-items: center;
    z-index: 10000;
    display: flex;
}

.m-popup-question {
    width: 366px;
    min-height: 345px;
    background-color: #fff;
    border-radius: 16px;
    padding: 0 14px;
}

.error-popup-question {
    min-height: 200px;
}

.popup-question-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 16px;
    padding: 16px 0;
}

.popup-question-content i {
    font-size: 36px;
    padding: 6px 0;
    text-align: center;
    width: 48px;
    height: 48px;
    margin-right: 12px;
}

.popup-question-footer {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 16px;
}

.button-close {
    background-color: #FFFFFF !important;
    border: 1px solid #777E89 !important;
    color: #777E89 !important;
}

.list-button {
    display: flex;
    justify-items: center;
    justify-content: center;
}

.popup-question-text {
    text-align: center;
    font-weight: 600;
    font-size: 21px;
}

.button {
    height: 40px;
    min-width: 100px;
    border: 1px solid transparent;
    color: #fff;
    background: #FC4B6C;
    border-radius: 4px;
    font-size: 16px;
    padding: 0 12px;
    cursor: pointer;
    transition: all linear 0.6s;
}
</style>
<script>
export default {
    props: ['title'],
    components: {
    },
}
</script>