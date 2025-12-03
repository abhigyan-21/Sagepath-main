import { supabase } from './config/supabase.js';

async function checkCourses() {
    const { data, error } = await supabase
        .from('courses')
        .select('*');

    if (error) {
        console.error('Error fetching courses:', error);
    } else {
        console.log('Courses found:', data.length);
        console.log(data);
    }
}

checkCourses();
