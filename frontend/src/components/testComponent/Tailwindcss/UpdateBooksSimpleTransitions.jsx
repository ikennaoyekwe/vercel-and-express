import * as React from "react";

export default function UpdateBooksSimpleTransitions(){

    const [myFocus, setMyFocus] = React.useState(false);

    const doSomeShit = () => {
        console.log('some shit was done baby');
    }

    return(
        <div className="flex flex-col text-center min-h-[90vh] justify-center items-center">
            <form onSubmit={doSomeShit} method="POST" className="w-full max-w-md bg-gray-700 rounded-lg shadow-l h-[250px]">

                <h1 className={`text-xl text-white mt-5 ${myFocus ? 'transition bg-gray-500' : ''}`}>
                    Update Books Transition
                </h1>

                <input
                    type="text"
                    name="testName"
                    placeholder="enter texts"
                    className="mt-10 px-3 py-2 ml-2 mr-2 w-[250px] rounded-lg"
                    onFocus={()=>setMyFocus(true)}
                    onBlur={()=>setMyFocus(false)}
                />

            </form>
        </div>
    )
}
