import { useState } from 'react';
import { StyleSheet, TouchableOpacity,View, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { myClassConverter } from '@/lib/performActions';

export function Collapsible({ children, title ,darkTheme}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className={darkTheme === "dark" ? "dark" : ""}>
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
            color={darkTheme === "dark" ? "#FFFFFF" : "#171717"}
            style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          />
        </View>

        <View className='py-4 pr-4 flex-1'>
          <Text className={myClassConverter(
              darkTheme,
              `text-lg font-pmedium`,
              "text-white",
              "text-black-100"
          )}>{title}</Text>
        </View>
      </TouchableOpacity>
      {isOpen && <View className={myClassConverter(
          darkTheme,
          `border-t flex-1 p-4`,
          "border-[#495161]",
          "border-border-100"
      )}>
        <Text className={myClassConverter(
            darkTheme,
            `text-base font-pregular`,
            "text-[#808D9E]",
            "text-black-200"
        )}>
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
 