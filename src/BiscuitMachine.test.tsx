import { configure, shallow } from "enzyme";
import ReactDOM from "react-dom";
import BiscuitMachine, { BiscuitMachineState, BiscuitState, MinBakingTemperature } from "./BiscuitMachine";
import { SwitchPosition } from "./machine-elements/Switch";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
let wrapper: BiscuitMachine;

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BiscuitMachine />, div);
});

describe("Test BiscuitMachine component", () => {
    beforeEach(() => {
        wrapper = shallow<BiscuitMachine, {}, BiscuitMachineState>(<BiscuitMachine />).instance();
    });

    it("switch position is updated and updateMessages is called on positionChanged", () => {
        const newSwitchPosition: SwitchPosition = SwitchPosition.On;
        const oldSwitchPosition: SwitchPosition = wrapper.state.switchPosition;
        const updateMessagesSpy = jest.spyOn(wrapper, "updateMessages");
        wrapper.positionChanged(newSwitchPosition);

        expect(wrapper.state.switchPosition).toEqual(newSwitchPosition);
        expect(oldSwitchPosition).not.toEqual(wrapper.state.switchPosition);
        
        expect(updateMessagesSpy).toHaveBeenCalledTimes(1);
        expect(updateMessagesSpy).toHaveBeenCalledWith(newSwitchPosition);
    });

    it("only motorPulsed is called when conveyor is empty on pulse", () => {
        const motorPulsedSpy = jest.spyOn(wrapper, "motorPulsed");
        const updateConveyorSpy = jest.spyOn(wrapper, "updateConveyor");
        const isConveyorEmptySpy = jest.spyOn(wrapper, "isConveyorEmpty");
        
        wrapper.pulse();

        expect(isConveyorEmptySpy).toHaveBeenCalledTimes(1);
        expect(motorPulsedSpy).toHaveBeenCalledTimes(1);
        expect(updateConveyorSpy).not.toHaveBeenCalled();
    });

    it("updateConveyor is called when conveyor is NOT empty on pulse", () => {
        wrapper.setState({
            conveyor: [BiscuitState.Stamped]
        });

        const motorPulsedSpy = jest.spyOn(wrapper, "motorPulsed");
        const updateConveyorSpy = jest.spyOn(wrapper, "updateConveyor");
        const isConveyorEmptySpy = jest.spyOn(wrapper, "isConveyorEmpty");
        
        wrapper.pulse();

        expect(isConveyorEmptySpy).toHaveBeenCalledTimes(1);
        expect(motorPulsedSpy).toHaveBeenCalledTimes(1);
        expect(updateConveyorSpy).toHaveBeenCalledTimes(1);
    });

    it("oven & motor are updated on getTemperature", () => {
        const updateOvenSpy = jest.spyOn(wrapper, "updateOven");
        const updateMotorSpy = jest.spyOn(wrapper, "updateMotor");;
        
        const temperature: number = 110;
        wrapper.getTemperature(temperature);

        expect(updateOvenSpy).toHaveBeenCalledTimes(1);
        expect(updateOvenSpy).toHaveBeenCalledWith(temperature);

        expect(updateMotorSpy).toHaveBeenCalledTimes(1);
        expect(updateMotorSpy).toHaveBeenCalledWith(temperature);
    });
});