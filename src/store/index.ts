import { ref } from "vue";

const buttonCreatePost = ref(false)
const loadingCreatePost = ref(false)
const buttonCreateTopic = ref(false)
const loadingCreateTopic = ref(false)

const revertButtonCreatePost = () => {
    buttonCreatePost.value = !buttonCreatePost.value
}

const setLoadingCreatePost = (value: boolean) => {
    loadingCreatePost.value = value
}

const revertButtonCreateTopic = () => {
    buttonCreateTopic.value = !buttonCreateTopic.value
}

const setLoadingCreateTopic = (value: boolean) => {
    loadingCreateTopic.value = value
}

export {
    buttonCreatePost,
    loadingCreatePost,
    buttonCreateTopic,
    loadingCreateTopic,
    revertButtonCreatePost,
    setLoadingCreatePost,
    revertButtonCreateTopic,
    setLoadingCreateTopic
}