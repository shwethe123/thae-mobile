// ...
export const addPostReview = async (postId, reviewData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/job-posts/${postId}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });
        return handleResponse(response); // Assuming you have a handleResponse function
    } catch (error) {
        console.error('Failed to add review:', error);
        throw error;
    }
};