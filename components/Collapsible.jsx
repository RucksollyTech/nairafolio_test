import { useState } from 'react';
import { StyleSheet, TouchableOpacity,View, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export function Collapsible({ children, title }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
        className='flex-1'
      >
        <View className='pl-4'>
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            className="text-black-100 dark:text-white"
            style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          />
        </View>

        <View className='py-4 pr-4 flex-1'>
          <Text className='text-black-100 dark:text-white text-lg font-pmedium'>{title}</Text>
        </View>
      </TouchableOpacity>
      {isOpen && <View className='border-t flex-1 border-border dark:border-[#3B3C43]-100 p-4'>
        <Text className='text-base font-pregular text-black-200'>
          {children}
        </Text>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
 