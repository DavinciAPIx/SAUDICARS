import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useI18n } from '@/contexts/I18nContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MessageSquare, Bell, Search } from 'lucide-react-native';
import { router } from 'expo-router';

type Tab = 'chats' | 'notifications';
type Message = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  time: string;
  unread: number;
};
type Notification = {
  id: string;
  type: 'booking_request' | 'booking_approved' | 'booking_declined' | 'message';
  title: string;
  message: string;
  time: string;
  relatedId?: string;
  isRead: boolean;
  userAvatar?: string;
};

// Mock data
const mockMessages: Message[] = [
  {
    id: 'msg1',
    userId: 'user2',
    userName: 'Ahmed Ali',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Is the car still available for this weekend?',
    time: '10:30 AM',
    unread: 2,
  },
  {
    id: 'msg2',
    userId: 'user3',
    userName: 'Sara Mohammed',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: "I've confirmed your booking for tomorrow",
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: 'msg3',
    userId: 'user4',
    userName: 'Khalid Omar',
    userAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Thank you for returning the car in great condition!',
    time: 'Monday',
    unread: 0,
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    type: 'booking_request',
    title: 'New Booking Request',
    message: 'Ahmed Ali wants to book your Toyota Camry',
    time: '2 hours ago',
    relatedId: 'booking1',
    isRead: false,
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'notif2',
    type: 'booking_approved',
    title: 'Booking Approved',
    message: 'Your booking for the Mercedes C-Class has been approved',
    time: 'Yesterday',
    relatedId: 'booking2',
    isRead: true,
  },
  {
    id: 'notif3',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Sara Mohammed',
    time: '2 days ago',
    relatedId: 'msg2',
    isRead: true,
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function MessagesScreen() {
  const { t, isRTL } = useI18n();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [searchQuery, setSearchQuery] = useState('');

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[
        styles.title,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
        }
      ]}>
        {t('messages.inbox')}
      </Text>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'chats' && { borderBottomColor: colors.primary },
        ]}
        onPress={() => setActiveTab('chats')}
      >
        <MessageSquare
          size={20}
          color={activeTab === 'chats' ? colors.primary : colors.textSecondary}
        />
        <Text style={[
          styles.tabText,
          { 
            color: activeTab === 'chats' ? colors.primary : colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
          }
        ]}>
          {t('messages.chats')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'notifications' && { borderBottomColor: colors.primary },
        ]}
        onPress={() => setActiveTab('notifications')}
      >
        <Bell
          size={20}
          color={activeTab === 'notifications' ? colors.primary : colors.textSecondary}
        />
        <Text style={[
          styles.tabText,
          { 
            color: activeTab === 'notifications' ? colors.primary : colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
          }
        ]}>
          {t('messages.notifications')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={[
      styles.searchContainer,
      { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }
    ]}>
      <Search size={20} color={colors.textSecondary} />
      <TextInput
        style={[
          styles.searchInput,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}
        placeholder={t('common.search')}
        placeholderTextColor={colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={[styles.messageItem, { borderBottomColor: colors.border }]}
      onPress={() => router.push(`/chat/${item.userId}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
        {item.unread > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[
            styles.userName,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
            }
          ]}>
            {item.userName}
          </Text>
          <Text style={[
            styles.messageTime,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            {item.time}
          </Text>
        </View>
        
        <Text 
          style={[
            styles.messageText,
            { 
              color: item.unread > 0 ? colors.text : colors.textSecondary,
              fontWeight: item.unread > 0 ? '500' : 'normal',
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        { backgroundColor: item.isRead ? colors.background : colors.backgroundSecondary }
      ]}
      onPress={() => {
        // Handle notification click based on type
        if (item.type === 'message' && item.relatedId) {
          router.push(`/chat/${item.relatedId}`);
        } else if (item.relatedId) {
          router.push(`/booking/${item.relatedId}`);
        }
      }}
    >
      {item.userAvatar ? (
        <Image source={{ uri: item.userAvatar }} style={styles.notificationAvatar} />
      ) : (
        <View 
          style={[
            styles.notificationIcon, 
            { backgroundColor: getNotificationColor(item.type, colors) }
          ]}
        >
          {getNotificationIcon(item.type, colors)}
        </View>
      )}
      
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationTitle,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
          }
        ]}>
          {item.title}
        </Text>
        
        <Text 
          style={[
            styles.notificationMessage,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
        
        <Text style={[
          styles.notificationTime,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getNotificationColor = (type: Notification['type'], colors: any) => {
    switch (type) {
      case 'booking_request':
        return colors.warning;
      case 'booking_approved':
        return colors.success;
      case 'booking_declined':
        return colors.error;
      case 'message':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const getNotificationIcon = (type: Notification['type'], colors: any) => {
    switch (type) {
      case 'booking_request':
        return <Bell size={20} color="white" />;
      case 'booking_approved':
        return <Bell size={20} color="white" />;
      case 'booking_declined':
        return <Bell size={20} color="white" />;
      case 'message':
        return <MessageSquare size={20} color="white" />;
      default:
        return <Bell size={20} color="white" />;
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <MessageSquare size={60} color={colors.textSecondary} />
      <Text style={[
        styles.emptyStateTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        {t('messages.noMessages')}
      </Text>
      <Text style={[
        styles.emptyStateSubtitle,
        { 
          color: colors.textSecondary,
          fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
        }
      ]}>
        {t('messages.startConversation')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      {renderTabs()}
      {renderSearchBar()}
      
      {activeTab === 'chats' ? (
        <FlatList
          data={mockMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
        />
      ) : (
        <FlatList
          data={mockNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    marginLeft: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    height: '100%',
    fontSize: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
  },
  notificationAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});