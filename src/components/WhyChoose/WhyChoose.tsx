import style from './WhyChoose.module.scss'
import {items} from "./items";
import {Form} from "../form";
import frog_mobile from '../../assets/images/why choose/frog_mobile.png';
import frog_desktop from '../../assets/images/why choose/frog_desktop.png';
import wall from '../../assets/images/why choose/wall.png';
import icon_left from '../../assets/images/why choose/icon_left.png';
import icon_right from '../../assets/images/why choose/icon_right.png';

export const WhyChoose = () => {
    return (
        <div className={style.whyChoose}>
            <div className={style.inner}>

                <h2 className={style.title}>
                    Why Choose <span>GAMEFROG?</span>
                </h2>

                <div className={style.content}>

                    <div className={style.top}>
                        <p className={style.label}>
                            Features:
                        </p>

                        <div className={style.items}>
                            {
                                items.map(({icon_main, title, text, icon_small}, key) => (
                                    <div key={key}
                                         className={style.item}
                                    >
                                        <div className={style.icon_main}>
                                            {icon_main}
                                        </div>

                                        <div>
                                            <p>{title}</p>
                                            <p>{text}</p>
                                        </div>
                                        {icon_small}
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className={style.formWrapper}>
                        <Form/>
                    </div>

                    <img src={frog_mobile} alt="" className={style.frog_mobile}/>
                    <img src={frog_desktop} alt="" className={style.frog_desktop}/>
                    <img src={wall} alt="" className={style.wall}/>
                    <img src={icon_left} alt="" className={style.icon_left}/>
                    <img src={icon_right} alt="" className={style.icon_right}/>

                </div>


            </div>
        </div>
    )
}