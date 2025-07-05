import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostPage = () => {
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([
    {
      id: '1',
      user: 'John Doe',
      text: 'Loving the new products!',
      likes: 2,
      image: 'https://picsum.photos/200',
    },
  ]);

  const createPost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      user: 'You',
      text: postText,
      likes: 0,
    };
    setPosts([newPost, ...posts]);
    setPostText('');
  };

  const likePost = (id) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
  };

  return (
    <View style={styles.container}>
      {/* Create Post */}
      <View style={styles.createPostBox}>
        <TextInput
          placeholder="What's on your mind?"
          value={postText}
          onChangeText={setPostText}
          style={styles.textInput}
          multiline
        />
        <TouchableOpacity style={styles.postButton} onPress={createPost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Ionicons name="person-circle" size={30} color="#555" />
              <Text style={styles.postUser}>{item.user}</Text>
            </View>
            <Text style={styles.postText}>{item.text}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
            <View style={styles.postFooter}>
              <TouchableOpacity onPress={() => likePost(item.id)} style={styles.likeBtn}>
                <Ionicons name="heart-outline" size={20} color="#e63946" />
                <Text style={styles.likeText}>{item.likes} Likes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default PostPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  createPostBox: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  textInput: {
    minHeight: 60,
    fontSize: 16,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#2a9d8f',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  postUser: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  postText: {
    fontSize: 15,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: 6,
    color: '#e63946',
    fontWeight: '500',
  },
});
