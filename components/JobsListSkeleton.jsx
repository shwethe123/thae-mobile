// components/JobsListSkeleton.jsx

import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS } from '../constants/colors';

const JobsListSkeleton = () => {
  return (
    <View style={{ marginBottom: 16, paddingHorizontal: 20 }}>
      <SkeletonPlaceholder 
        borderRadius={4} 
        backgroundColor={COLORS.border} 
        highlightColor="#EAEAEA"
      >
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item width={250} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={200} height={15} />
            <SkeletonPlaceholder.Item marginTop={6} width={150} height={15} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default JobsListSkeleton;