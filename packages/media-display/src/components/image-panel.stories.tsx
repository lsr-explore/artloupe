import type { Meta, StoryObj } from '@storybook/react';
import type { ImageType } from '../../../shared-types/src/types/image-type';
import { mockImageTypes } from '../__stories__/mock-data';
import { ImagePanel } from './image-panel';

const ImagePanelStory = ({ image }: { image: ImageType }) => (
  <div style={{ maxWidth: 400 }}>
    <ImagePanel image={image} />
  </div>
);

const meta: Meta<typeof ImagePanel> = {
  title: 'Components/ImagePanel',
  component: ImagePanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    image: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: mockImageTypes[0],
  },
};

export const WithLongTitle: Story = {
  args: {
    image: {
      ...mockImageTypes[0],
      title:
        'This is a very long image title that should demonstrate how the component handles text overflow and wrapping in the UI',
    },
  },
};

export const WithLongDescription: Story = {
  args: {
    image: {
      ...mockImageTypes[0],
      description:
        'This is a very long description that should demonstrate how the component handles text overflow and wrapping in the UI. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.',
    },
  },
};

export const WithoutImage: Story = {
  args: {
    image: {
      ...mockImageTypes[2],
      imageUrl: '',
    },
  },
};

export const WithoutArtist: Story = {
  args: {
    image: {
      ...mockImageTypes[0],
      artist: '',
    },
  },
};

export const MultipleImages: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
      {mockImageTypes.map((image) => (
        <ImagePanelStory key={image.id} image={image} />
      ))}
    </div>
  ),
};
