import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { firebase } from "../../firebaseConfig";

backColor = "black";
cardColor = "#eed9c4";
textColor = "black";

const Comment = ({ route }) => {
  const { postId } = route.params;
  const [comments, setComments] = useState("");
  const [newComment, setNewComment] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const postRef = firebase.firestore().collection("Posts").doc(postId);
    postRef.get().then((doc) => {
      const data = doc.data();
      setComments(data.comments.replace(/\. /g, "\n"));
    });

    // Get the currently logged in user
    const getCurrentUser = async () => {
      const currentUser = firebase.auth().currentUser;
      const { uid } = currentUser;
      const userRef = firebase.firestore().collection("Users").doc(uid);
      const userDoc = await userRef.get();
      setFirstName(userDoc.data().firstName);
      setLastName(userDoc.data().lastName);
    };
    getCurrentUser();
  }, [postId]);

  const handleAddComment = () => {
    // If the new comment input field is not empty
    if (newComment.trim()) {
      // Reference to the post document
      const postRef = firebase.firestore().collection("Posts").doc(postId);

      // Update the new comment
      postRef
        .update({
          comments:
            comments + "\n" + `${firstName} ${lastName}: ` + newComment.trim(),
        })
        .then(() => {
          // Show the new comment
          setComments(
            (prevComments) =>
              prevComments +
              "\n" +
              `${firstName} ${lastName}: ` +
              newComment.trim()
          );
          // Clear the comment input box
          setNewComment("");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.commentText}>{comments}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add Comment!"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backColor,
  },
  commentText: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 10,
    marginLeft: 10,
    marginTop: 10,
    color: cardColor,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cardColor,
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: backColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: cardColor,
    fontSize: 16,
  },
});
