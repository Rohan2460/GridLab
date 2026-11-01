const courses: string[] = [
    "ABC1 - C Programming",
    "ABC2 - Databases",
    "AB11 - Java Programming"
]

const assignmets: string[] = [
    "Write a simple c program",
    "Implement C program to add 2 numbers",
]


export default function Student() {
    const listCourses = courses.map(course => 
        <li><p> {course} </p></li>
    )

    const listActivites = assignmets.map(item =>
        <li><p> {item} </p></li>
    )

    return (
        <>
            <h1>Studnet Page</h1>
            
            <div className="course-list">
                <p>Courses</p>
                <ul>
                    {listCourses}
                </ul>
            </div>

            <div className="activites">
                <p>Activites</p>
                <ul>
                    {listActivites}
                </ul>
            </div>
        </>
    ); 
}