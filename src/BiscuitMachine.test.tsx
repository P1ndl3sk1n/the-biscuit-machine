import { configure, shallow } from "enzyme";
import ReactDOM from "react-dom";
import BiscuitMachine, { BiscuitMachineState } from "./BiscuitMachine";
import { SwitchPosition } from "./machine-elements/Switch";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
let wrapper: any;

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BiscuitMachine />, div);
});

describe("Test BiscuitMachine component", () => {
    beforeAll(() => {
        wrapper = shallow<BiscuitMachine, {}, BiscuitMachineState>(<BiscuitMachine />).instance();
    });

    it("updateMessages function is called on positionChanged", () => {
        const spyUpdateMessages = jest.spyOn(wrapper, "updateMessages");
        wrapper.positionChanged(SwitchPosition.On);
        
        expect(spyUpdateMessages).toHaveBeenCalledTimes(1);
        expect(spyUpdateMessages).toHaveBeenCalledWith(SwitchPosition.On);
    });
});