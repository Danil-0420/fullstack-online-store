import {useState} from "react";
import {InputGroup, Form, Button} from "react-bootstrap";


const SearchBar = () => {

    const [search, setSearch] = useState("")
    const searchProducts = ()=>{
        console.log(search)
    }

    return (
        <InputGroup  style={{width:'600px'}}>
            <Form.Control
                type="search"
                onChange={(e)=> setSearch(e.target.value)}
                placeholder="What are you lookign for?" />

            <Button variant='light' onClick={searchProducts}>Search</Button>
        </InputGroup>
    );
};

export default SearchBar;