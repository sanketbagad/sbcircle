import axios from "axios"
import { setAlert } from "./alert"
import {
    ADD_COMMENT,
    ADD_POST,
    DELETE_POST,
    GET_POST,
    GET_POSTS,
    POST_ERROR,
    REMOVE_COMMENT,
    UPDATE_LIKES
} from "./types"

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get("/api/posts")

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const getPost = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`)

        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const addLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const deletePost = (postId) => async dispatch => {
    try {
        
        await axios.delete(`/api/posts/${postId}`)

        dispatch({
            type: DELETE_POST,
            payload: postId
        })

        dispatch(setAlert("Post Deleted" , "success"))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const addPost = (formData) => async dispatch => {
    
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    try {
        const res = await axios.post(`/api/posts`, formData, config)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert("Post Created" , "success"))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const addComment = (postId, formData) => async dispatch => {
    
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    try {
        const res = await axios.post(`/api/posts/comments/${postId}`, formData, config)

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert("Comment Succeed" , "success"))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

export const deleteComment = (postId, commentId) => async dispatch => {
    
    try {
        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`)

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })

        dispatch(setAlert("Comment Vanished" , "success"))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}