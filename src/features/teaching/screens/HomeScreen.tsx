import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from '@react-navigation/native';
import { SectionHeader } from '../../../../lib/ui/components/SectionHeader';
import { useGetStudent } from '../../../core/hooks/studentHooks';
import { useGetCourses } from '../hooks/courseHooks';
import { useGetExams } from '../hooks/examHooks';

export const HomeScreen = () => {
  const { t } = useTranslation();

  const { data: coursesResponse, isLoading: isCoursesLoading } =
    useGetCourses();
  const { data: examsResponse } = useGetExams();
  const { data: studentResponse } = useGetStudent();
  return (
    <View>
      <View style={styles.sectionsContainer}>
        <View style={styles.section}>
          <SectionHeader title={t('Courses')} linkTo={{ screen: 'Courses' }} />
          {isCoursesLoading && <Text>Loading</Text>}
          <View>
            {coursesResponse?.data.slice(0, 4).map(c => (
              <Link
                key={c.shortcode}
                to={{ screen: 'Course', params: { id: c.id } }}
              >
                <Text>{JSON.stringify(c)}</Text>
              </Link>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <SectionHeader title={t('Exams')} linkTo={{ screen: 'Exams' }} />
          <View>
            {examsResponse?.data.slice(0, 4).map(e => (
              <Link key={e.id} to={{ screen: 'Exam', params: { id: e.id } }}>
                <Text>{JSON.stringify(e)}</Text>
              </Link>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <SectionHeader
            title={t('Transcript')}
            linkTo={{ screen: 'Grades' }}
          />
          {studentResponse && (
            <Link to={{ screen: 'Grades' }}>
              <Text>{JSON.stringify(studentResponse.data)}</Text>
            </Link>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionsContainer: {
    display: 'flex',
    paddingVertical: 18,
  },
  section: {
    marginBottom: 24,
  },
});
