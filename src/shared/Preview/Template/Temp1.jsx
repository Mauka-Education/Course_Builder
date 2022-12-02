
const Temp1 = ({ data }) => {
    const dummyText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. A cum, blanditiis aspernatur quibusdam fugit enim omnis nostrum amet, numquam tempore possimus officia obcaecati veritatis. Alias dignissimos deserunt reiciendis? In, consectetur!Sunt, pariatur recusandae at dolor a sint incidunt omnis voluptatem, voluptate sit facere dolorem eos. Enim, nemo molestiae! Optio excepturi minus, iste accusamus laudantium officia facilis quis hic asperiores culpa."
    return (
        <div className={`temp1 ${data?.allSlide && "all"}`}>
            <div className="title">
                <h1>{(data?.title?.length!==0 && data?.title)  ? data?.title  : "Title"}</h1>
            </div>
            <div className="subtitle">
                <h3>{(data?.subheading?.length!==0 && data?.title)  ? data?.subheading : "Subtitle"}</h3>
                
            </div>
            <div className="paragraph" dangerouslySetInnerHTML={{ __html:   (data?.para?.length!==0 && data?.para)   ? data?.para : dummyText }} />
        </div>
    )
}

export default Temp1