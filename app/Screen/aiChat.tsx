import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import ScreenLayout from '../../src/components/ScreenLayout';
import StudentHeader from '../../src/components/StudentHeader';

type Message = {
    id: string;
    text: string;
    sender: "user" | "ai";
};

export default function AIChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔌 BACKEND CONNECTABLE FUNCTION
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // 🔗 Replace this with your backend API later
            // Example:
            // const response = await fetch("https://your-api.com/chat", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ message: input }),
            // });
            // const data = await response.json();

            // TEMP AI RESPONSE (Mock)
            const aiReply: Message = {
                id: Date.now().toString() + "_ai",
                text: "This is a sample AI response. Connect backend later.",
                sender: "ai",
            };

            setMessages((prev) => [...prev, aiReply]);
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageBubble,
                item.sender === "user" ? styles.userBubble : styles.aiBubble,
            ]}
        >
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <ScreenLayout>
            <StudentHeader showBackButton={true} title="AI Chat" />

            <View style={styles.container}>
                {/* HEADER TITLE (Optional, if you want a sub-header or title below the main header) */}
                {/* <View style={styles.subHeader}>
                    <Text style={styles.headerTitle}>AI Chat</Text>
                    <MaterialIcons name="smart_toy" size={28} color="#000" />
                </View> */}

                {/* NEW CHAT ROW */}
                <View style={styles.newChatRow}>
                    <Feather name="menu" size={24} color="#000" />
                    <Text style={styles.newChatText}>New Chat</Text>
                    <Feather name="edit" size={20} color="#000" />
                </View>

                {/* CHAT AREA */}
                {messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>AI</Text>
                        <Text style={styles.emptyText}>Chat Bot</Text>
                    </View>
                ) : (
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        contentContainerStyle={{ padding: 16 }}
                    />
                )}

                {/* INPUT AREA */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.inputContainer}>
                        <TouchableOpacity>
                            <Ionicons name="link" size={22} color="#666" />
                        </TouchableOpacity>

                        <TextInput
                            placeholder="Enter the Question"
                            style={styles.input}
                            value={input}
                            onChangeText={setInput}
                        />

                        <TouchableOpacity onPress={sendMessage}>
                            <Ionicons name="send" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* OPTIONS */}
                    <View style={styles.optionRow}>
                        <View style={styles.optionChip}>
                            <Text>Think R1</Text>
                        </View>
                        <View style={styles.optionChip}>
                            <Text>Internet</Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>

                {/* BOTTOM NAV */}
                {/* Removed custom bottom nav as we are likely in a stack or using tab bar */}
                {/* <View style={styles.bottomNav}>
                    <Ionicons name="home" size={24} />
                    <Ionicons name="calendar" size={24} />
                    <Ionicons name="document-text" size={24} />
                    <Ionicons name="stats-chart" size={24} />
                </View> */}
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FA",
    },



    /* ---------- NEW CHAT ROW ---------- */
    newChatRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 14,
        elevation: 2,
    },

    newChatText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },

    /* ---------- EMPTY STATE ---------- */
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyText: {
        fontSize: 42,
        fontWeight: "800",
        color: "#E1E3E8",
    },

    /* ---------- CHAT BUBBLES ---------- */
    messageBubble: {
        maxWidth: "78%",
        padding: 14,
        borderRadius: 18,
        marginVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
    },

    userBubble: {
        backgroundColor: "#4F46E5",
        alignSelf: "flex-end",
        borderBottomRightRadius: 4,
    },

    aiBubble: {
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-start",
        borderBottomLeftRadius: 4,
    },

    messageText: {
        fontSize: 15,
        lineHeight: 21,
        color: "#111",
    },

    /* ---------- INPUT BAR ---------- */
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginBottom: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 30,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },

    input: {
        flex: 1,
        fontSize: 15,
        paddingHorizontal: 10,
        color: "#111",
    },

    /* ---------- OPTION CHIPS ---------- */
    optionRow: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingBottom: 10,
    },

    optionChip: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 22,
        marginRight: 10,
        elevation: 2,
    },

    optionChipText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#444",
    },


});



