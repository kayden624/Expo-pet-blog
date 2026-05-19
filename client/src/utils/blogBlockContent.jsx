const List = ({ style, items }) => {
    return (
        <ol className={`pl-5 ${style == "ordered" ? " list-decimal" : " list-disc"}`}>
            {items.map((listItem, i) => {
                return <li key={i} dangerouslySetInnerHTML={{ __html: listItem }}></li>;
            })}
        </ol>
    );
};

const Quote = ({ quote, caption }) => {
    return (
        <div className="bg-red/10 pl-5 border-l-4 border-red">
            <p className="text-xl leading-10 md:text-2xl">{quote}</p>
            {caption.length ? <p className="w-full text-purple text-base">{caption}</p> : ""}
        </div>
    );
};

const Checklist = ({ items }) => {
    return (
        <div>
            {items.map((listItem, i) => {
                return (
                    <div key={i} className="flex mb-1">
                        <span className="border border-dark-grey w-[20px] h-[20px] rounded-lg text-center mr-2">
                            {listItem.checked ? <i className="fi fi-br-check text-red"></i> : ""}
                        </span>
                        <p>{listItem.text}</p>
                        {/* <input type="checkbox" checked={listItem.checked} className="mr-2" />
            <label>{listItem.text}</label> */}
                    </div>
                );
            })}
        </div>
    );
};

const BlogBlockContent = ({ block }) => {
    let { type, data } = block;
    if (type == "paragraph") {
        return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
    }

    if (type == "header") {
        if (data.level == 3) {
            return <h3 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: data.text }}></h3>;
        }
        return <h2 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: data.text }}></h2>;
    }

    if (type == "list") {
        return <List style={data.style} items={data.items} />;
    }

    if (type == "quote") {
        return <Quote quote={data.text} caption={data.caption} />;
    }

    if (type == "checklist") {
        return <Checklist items={data.items} />;
    }
    if (type == "image") {
        return <img style={{ width: "100%" }} src={data.file.url} />;
    }

    return <p>Unrecognized content!!</p>;
};

export default BlogBlockContent;
