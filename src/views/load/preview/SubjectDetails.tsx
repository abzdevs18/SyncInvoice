// pages/posts/[id].js

export default function SubjectDetails({ data, type }) {
  // Use the post data to render the page
  return (
    <div>
      <h1>
        {data.name} {type}
      </h1>
      <p>{data.company}</p>
    </div>
  )
}
