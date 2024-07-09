import styles from "@/module/TextList.module.css";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";

const TextList = ({ title, profileData, setProfileData, type }) => {
  //ghavanin va emkanat refahi har do araye hastand pas bayad in do ra gerefte va ruye oon ha map bezanim

  const addHandler = () => {
    //in bakhsh baraye afzudan yek input ast ke dar oon type konim.beguneee ke mige aval maghadir ghabli ro negah dar bad bia typesh ro bia type haye ghabli bezar agar hast va ye jaye khali ijad kon.
    setProfileData({ ...profileData, [type]: [...profileData[type], ""] });
  };

  const changeHandler = (e, index) => {
    //dar inja vaghti yek ebarati ro dar ja khali ha type mkonim va vaghti agahi ro sabt mikonim miad meghdar har kodum ro migire va dar jaygahesh zakhire mikone.
    //dar mar hale aval value ro migirim ke abarat vared shode ast.dar marhale bad meghdar ghabli hayee ke type shode buud ro darun list minevisim.va oono mosavi value gharar midahim.sepas maghadir ro dar profileData set mikonim mikonim.
    const { value } = e.target;
    const list = [...profileData[type]];
    list[index] = value;
    setProfileData({ ...profileData, [type]: list });
  };

  const deleteHandler = (index) => {
    //dar inja ba estefade az splice miaim va migim nesbat be oon indexe yeki kam kon yani oono hazf kon.va bad dobare meghdar jadid ro set kon.
    const list = [...profileData[type]];
    list.splice(index, 1);
    setProfileData({ ...profileData, [type]: list });
  };

  return (
    <div className={styles.container}>
      <p>{title}</p>
      {
        //dar in ja migim dar dakhel profileData bia va typesh ro begir va rush map bezan va oon haro ba indexeshun begir chon mikhaim oon ro be onvane key beheshun bedim.
        profileData[type].map((i, index) => (
          <div className={styles.card} key={index}>
            <input
              type="text"
              value={i}
              onChange={(e) => changeHandler(e, index)}
            />
            <button onClick={() => deleteHandler(index)}>
              حذف
              <AiOutlineDelete />
            </button>
          </div>
        ))
      }
      <button onClick={addHandler}>
        افزودن
        <MdOutlineLibraryAdd />
      </button>
    </div>
  );
};

export default TextList;
